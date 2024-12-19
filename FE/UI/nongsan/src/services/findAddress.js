import axios from 'axios';

export const apiGetPublicProvinces = async () => {
    try {
        const response = await axios.get('https://vapi.vnappmob.com/api/province/');
        return response;  // Return the response directly, so you can handle it in the calling code
    } catch (error) {
        console.error('Error fetching provinces:', error);
        throw error; // Propagate the error to be handled by the caller
    }
};

export const apiGetPublicDistrict = async (provinceName) => {
    try {
        const response = await axios.get(`https://vapi.vnappmob.com/api/province/district/${provinceName}`);
        return response;
    } catch (error) {
        console.error('Error fetching districts:', error);
        throw error;
    }
};

export const apiGetPublicWard = async (districtName) => {
    try {
        const response = await axios.get(`https://vapi.vnappmob.com/api/province/ward/${districtName}`);
        return response;
    } catch (error) {
        console.error('Error fetching wards:', error);
        throw error;
    }
};
