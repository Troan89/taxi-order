export const fetchCrews = async (lat: number, lon: number) => {
    // Mock implementation
    return {
        code: 0,
        descr: 'OK',
        data: {
            crews_info: [
                {
                    crew_id: 125,
                    car_mark: 'Hyundai',
                    car_model: 'Solaris',
                    car_color: 'белый',
                    car_number: 'Ф567АС',
                    driver_name: 'Петров',
                    driver_phone: '8899',
                    lat: 56.860581,
                    lon: 53.209223,
                    distance: 600
                },
                {
                    crew_id: 123,
                    car_mark: 'Chevrolet',
                    car_model: 'Lacetti',
                    car_color: 'синий',
                    car_number: 'Е234КУ',
                    driver_name: 'Деточкин',
                    driver_phone: '7788',
                    lat: 56.855532,
                    lon: 53.217462,
                    distance: 300
                },
            ]
        }
    };
};
