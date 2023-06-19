/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
 export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}
/*
 * 银行账户验证
 */
export const bankAccountValid = (rule, value, callback) => {
  const strBin = '10,18,30,35,37,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,58,60,62,65,68,69,84,87,88,94,95,98,99'
  if (value=="") {
    return callback(new Error('银行账户不能为空'))
  } else if (!Number.isInteger(+value)) {
    callback(new Error('银行卡号必须全为数字'))
  } else if (value.trim().length < 15 || value.trim().length > 19) {
    callback(new Error('银行卡号长度必须在15到19之间'))
  } else if (strBin.indexOf(value.substring(0, 2)) === -1) {
    callback(new Error('银行卡号开头6位不符合规范'))
  } else {
    callback()
  }
}
/*
 * 身份证号验证
 */
export const checkIdCard = (rule,value,callback) => {
  let city={11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江 ",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北 ",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏 ",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外 "};
  let pass= false;

  let patt1=new RegExp("(^[1-9]\\d{5}(18|19|([23]\\d))\\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\\d{3}[0-9Xx]$)|(^[1-9]\\d{5}\\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\\d{2}$)");
  if(value == ''){
    pass = true;
  }else if(!patt1.test(value)){
    callback(new Error("证件号码格式错误"));
    pass = false;
  } else if(!city[value.substr(0,2)]){
    //地址编码错误
    callback(new Error("证件号码格式错误"));
    pass = false;
  }else{
    //18位身份证需要验证最后一位校验位
    if(value.length == 18){
      value = value.split('');
      //∑(ai×Wi)(mod 11)
      //加权因子
      let factor = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 ];
      //校验位
      let parity = [ 1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2 ];
      let sum = 0;
      let ai = 0;
      let wi = 0;
      for (let i = 0; i < 17; i++)
      {
        ai = value[i];
        wi = factor[i];
        sum += ai * wi;
      }
      if(parity[sum % 11] != value[17]){
        callback(new Error("证件号码格式错误"));
        pass =false;
      }
    }
  }
  if(pass){
    callback(new Error("证件号码不能为空"));
  }
  else{
    callback();
  }
}
/*
 * 交易密码验证
 */
export const transactionPasswordVerification = (rule,value,callback) => {
  if(value==""){
      callback(new Error('请输入交易密码'));
  }
  else if(value.length<6||value.length>6){
      callback(new Error('交易密码必须为6位数字！请重新输入'))
  }else{
    callback();
  }
}
/***
 * 交易金额验证
 */
export const transactionAmountVerification = (rule,value,callback) => {
  if(value==""){
      callback(new Error('请输入交易金额'));
  }
  else{
    callback();
  }
}

/**
 * 手机号验证
 */
export const mobilePhoneNumberVerification = (rule,value,callback) => {
  let reg=/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
  if(value==""){
      callback(new Error('请输入手机号'));
  }else if(!reg.test(value)){
      callback(new Error('请输入正确的手机号'));
  }else{
    callback();
  }
}


