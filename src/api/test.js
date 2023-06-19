import request from '@/utils/request'

export function getTableData(params) {
  return request({
    url: 'GeneralAccount/totalAccountFlowInquiry',
    method: 'get',
    params
  })
}
// export function getGeneralAccount(parms){
//   return request({
//     url: 'GeneralAccount/totalAccountFlowInquiry',
//     method: 'get',
//     params
//   })
// }