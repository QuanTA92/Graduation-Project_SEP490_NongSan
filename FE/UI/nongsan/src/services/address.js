// import axiosClient from "@/libraries/axiosClient";
import axiosDefault from 'axios'

// export const apiGetProvinces = () => new Promise(async (resolve, reject) => {
//     try {
//         const response = await axiosClient({
//             method: 'get',
//             url: '/api/v1/province/all'
//         })
//         resolve(response)
//     } catch (error) {
//         reject(error)
//     }
// })
export const apiGetPublicProvinces = () => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosDefault({
            method: 'get',
            url: 'https://vapi.vnappmob.com/api/province/'
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})
export const apiGetPublicDistrict = (provinceId) => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosDefault({
            method: 'get',
            url: `https://vapi.vnappmob.com/api/province/district/${provinceId}`
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})
export const apiGetPublicWard = (wardId) => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosDefault({
            method: 'get',
            url: `https://vapi.vnappmob.com/api/province/ward/${wardId}`
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})