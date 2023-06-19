// 此方法用来实现将一个字符串通过replace方法，格式化为普通数字格式（包括正负整数、正负浮点数都支持）
export const inputNumber = val => {
    if (val === '-' || !val) return val
    if (val === '.') return ''
  
    const reg1 = /[^\d|\-|\.]/g
    const reg2 = /(\d|\.)\-+/g
    const str = val.replace(reg1, '').replace(reg2, '$1')
    const pointArr = str.split('.')
    let value = ''
    if (pointArr.length > 1) {
      pointArr.forEach((item, index) => {
        value = value + item
        if (!index) {
          value = value + '.'
        }
      })
    } else {
      value = str
    }
    return value
  }