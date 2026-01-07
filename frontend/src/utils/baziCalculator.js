// 八字计算工具（简化版）
// 天干
const TIANGAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸']
// 地支
const DIZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']
// 生肖
const SHENGXIAO = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪']

/**
 * 计算年柱
 */
function getYearPillar(year) {
  // 1984年是甲子年（天干0，地支0）
  const baseYear = 1984
  const yearDiff = year - baseYear
  const tianganIndex = yearDiff % 10
  const dizhiIndex = yearDiff % 12

  return TIANGAN[tianganIndex < 0 ? tianganIndex + 10 : tianganIndex] +
         DIZHI[dizhiIndex < 0 ? dizhiIndex + 12 : dizhiIndex]
}

/**
 * 计算月柱（简化版，基于节气的精确计算较复杂）
 */
function getMonthPillar(year, month) {
  // 年干对应的月干起始
  const yearTianganIndex = (year - 4) % 10
  const monthTianganBase = (yearTianganIndex % 5) * 2

  // 月支固定：寅月(1月)开始
  const monthDizhiIndex = (month + 1) % 12
  const monthTianganIndex = (monthTianganBase + month - 1) % 10

  return TIANGAN[monthTianganIndex] + DIZHI[monthDizhiIndex]
}

/**
 * 计算日柱（简化版，使用基准日期推算）
 */
function getDayPillar(year, month, day) {
  // 使用1900年1月1日作为基准（庚戌日）
  const baseDate = new Date(1900, 0, 1)
  const targetDate = new Date(year, month - 1, day)
  const daysDiff = Math.floor((targetDate - baseDate) / (1000 * 60 * 60 * 24))

  // 1900年1月1日是庚戌日（天干6，地支10）
  const tianganIndex = (6 + daysDiff) % 10
  const dizhiIndex = (10 + daysDiff) % 12

  return TIANGAN[tianganIndex < 0 ? tianganIndex + 10 : tianganIndex] +
         DIZHI[dizhiIndex < 0 ? dizhiIndex + 12 : dizhiIndex]
}

/**
 * 计算时柱
 */
function getHourPillar(dayTianganIndex, hour) {
  // 时辰对应地支
  const hourDizhiIndex = Math.floor((hour + 1) / 2) % 12

  // 日干对应的时干起始
  const hourTianganBase = (dayTianganIndex % 5) * 2
  const hourTianganIndex = (hourTianganBase + hourDizhiIndex) % 10

  return TIANGAN[hourTianganIndex] + DIZHI[hourDizhiIndex]
}

/**
 * 计算完整八字
 */
export function calculateBazi(year, month, day, hour) {
  if (!year || !month || !day) {
    return null
  }

  const yearPillar = getYearPillar(year)
  const monthPillar = getMonthPillar(year, month)
  const dayPillar = getDayPillar(year, month, day)

  let hourPillar = ''
  if (hour !== null && hour !== undefined && hour !== '') {
    const dayTianganIndex = TIANGAN.indexOf(dayPillar[0])
    hourPillar = getHourPillar(dayTianganIndex, parseInt(hour))
  }

  return {
    yearPillar,
    monthPillar,
    dayPillar,
    hourPillar,
    shengxiao: SHENGXIAO[(year - 4) % 12]
  }
}

/**
 * 计算起运年龄（简化版）
 */
export function calculateStartAge(year, month, day, gender) {
  // 简化计算：根据性别和年份奇偶
  const yearTianganIndex = (year - 4) % 10
  const isYangYear = yearTianganIndex % 2 === 0
  const isMale = gender === 'Male'

  // 阳年男命、阴年女命顺行，反之逆行
  const isShunxing = (isYangYear && isMale) || (!isYangYear && !isMale)

  // 简化：假设在节气后出生，起运年龄约为3-8岁
  return isShunxing ? 3 : 8
}

/**
 * 计算第一步大运（简化版）
 */
export function calculateFirstDayun(year, month, gender) {
  const yearTianganIndex = (year - 4) % 10
  const isYangYear = yearTianganIndex % 2 === 0
  const isMale = gender === 'Male'

  const isShunxing = (isYangYear && isMale) || (!isYangYear && !isMale)

  // 月柱的下一柱或上一柱
  const monthDizhiIndex = (month + 1) % 12
  const monthTianganBase = (yearTianganIndex % 5) * 2
  const monthTianganIndex = (monthTianganBase + month - 1) % 10

  let dayunTianganIndex, dayunDizhiIndex
  if (isShunxing) {
    dayunTianganIndex = (monthTianganIndex + 1) % 10
    dayunDizhiIndex = (monthDizhiIndex + 1) % 12
  } else {
    dayunTianganIndex = (monthTianganIndex - 1 + 10) % 10
    dayunDizhiIndex = (monthDizhiIndex - 1 + 12) % 12
  }

  return TIANGAN[dayunTianganIndex] + DIZHI[dayunDizhiIndex]
}
