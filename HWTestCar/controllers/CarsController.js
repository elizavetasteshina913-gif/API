export default class CarsController {
    constructor(client) {
        this.client = client;
    }

    getBrands() {
        return this.client.get('/api/cars/brands');
    }

    getModels() {
        return this.client.get('/api/cars/models');
    }

    createCar(carData) {
        return this.client.post('/api/cars', carData);
    }
    getCars() {
        return this.client.get('/api/cars');
    }

    getCarById(id) {
        return this.client.get(`/api/cars/${id}`);
    }

    updateCar(id, carData) {
        return this.client.put(`/api/cars/${id}`, carData);
    }

    deleteCar(id) {
        return this.client.delete(`/api/cars/${id}`);
    }
}
