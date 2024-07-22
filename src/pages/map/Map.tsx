import React, { useEffect, useRef } from 'react';
import { setAddress, setCoordinates } from '../../store/OrderSlice';
import { useAppDispatch, useAppSelector } from '../../store';
import ManIcon from '../../images/location.png';
import taxiIcon from '../../images/1.png';

declare global {
    interface Window {
        ymaps: any;
    }
}

export const Map = () => {
    const dispatch = useAppDispatch();
    const crews = useAppSelector((state) => state.order.crews);
    const mapRef = useRef<any>(null);
    const placemarkRef = useRef<any>(null);
    const collectionRef = useRef<any>(null);

    useEffect(() => {
        if (window.ymaps) {
            window.ymaps.ready(init);
        } else {
            console.error('Yandex Maps API is not loaded');
        }

        function init() {
            if (!mapRef.current) {
                mapRef.current = new window.ymaps.Map('map', {
                    center: [56.839439, 53.218803],
                    zoom: 13,
                    searchControlProvider: 'yandex#search',
                });

                placemarkRef.current = new window.ymaps.Placemark([56.839439, 53.218803], {
                    hintContent: 'Откуда',
                    balloonContent: 'Откуда'
                }, {
                    iconLayout: 'default#image',
                    iconImageHref: ManIcon,
                    iconImageSize: [30, 42],
                    iconImageOffset: [-15, -42]
                });

                mapRef.current.geoObjects.add(placemarkRef.current);

                const searchButton = document.getElementById('searchButton');
                if (searchButton) {
                    searchButton.addEventListener('click', function () {
                        const addressInput = document.getElementById('addressInput') as HTMLInputElement;
                        if (addressInput) {
                            const address = addressInput.value;
                            window.ymaps.geocode(address).then(function (res: any) {
                                const firstGeoObject = res.geoObjects.get(0);
                                if (firstGeoObject) {
                                    const coords = firstGeoObject.geometry.getCoordinates();
                                    mapRef.current.setCenter(coords, 15);
                                    placemarkRef.current.geometry.setCoordinates(coords);
                                    placemarkRef.current.properties.set({
                                        hintContent: address,
                                        balloonContent: address
                                    });
                                    dispatch(setCoordinates(coords));
                                    dispatch(setAddress(address));
                                } else {
                                    alert('Адрес не найден. Пожалуйста, проверьте правильность ввода.');
                                }
                            }).catch(function (err: any) {
                                console.error('Ошибка при выполнении геокодирования: ', err);
                            });
                        }
                    });
                }

                mapRef.current.events.add('click', function (e: any) {
                    const coords = e.get('coords');
                    window.ymaps.geocode(coords).then((res: any) => {
                        const firstGeoObject = res.geoObjects.get(0);
                        const address = firstGeoObject ? firstGeoObject.getAddressLine() : 'Адрес не найден';
                        dispatch(setCoordinates(coords));
                        dispatch(setAddress(address));
                        placemarkRef.current.geometry.setCoordinates(coords);
                        placemarkRef.current.properties.set({
                            hintContent: address,
                            balloonContent: address
                        });

                        const addressInput = document.getElementById('addressInput') as HTMLInputElement;
                        if (addressInput) {
                            addressInput.value = address;
                        }
                    }).catch(function (err: any) {
                        console.error('Ошибка при выполнении геокодирования: ', err);
                    });
                });
            }

            if (!collectionRef.current) {
                collectionRef.current = new window.ymaps.GeoObjectCollection();
                mapRef.current.geoObjects.add(collectionRef.current);
            }
        }

    }, [dispatch]);

    useEffect(() => {
        if (collectionRef.current) {
            collectionRef.current.removeAll();



            const myPoints = crews.map((crew) => ({
                coords: [crew.lat, crew.lon],
                text: `${crew.car_mark} ${crew.car_model}`
            }));

            for (let point of myPoints) {
                const placemark = new window.ymaps.Placemark(
                    point.coords, {
                        hintContent: 'Taxi',
                        balloonContent: point.text
                    }, {
                        iconLayout: 'default#imageWithContent',
                        iconImageHref: taxiIcon,
                        iconImageSize: [48, 48],
                        iconImageOffset: [-24, -24]
                    }
                );
                collectionRef.current.add(placemark);
            }
        }
    }, [crews]);

    return (
        <div id="map" style={{ width: '100%', height: '400px' }}></div>
    );
};
