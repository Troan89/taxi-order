import React, {useState} from 'react';
import {setAddress, setCrewId, setCrews, setSourceTime, setCoordinates} from '../store/OrderSlice';
import {useAppDispatch, useAppSelector} from '../store';
import {Map} from "./map/Map";
import './OrderForm.css';
import carIcon from '../images/car.jpg';
import {CrewList} from "./crewList/CrewList";
import {fetchCrews} from "../services/crewService";
import {createOrder} from "../services/orderService";
import {OrderModal} from "./orderModal/OrderModal";

declare global {
    interface Window {
        ymaps: any;
    }
}

export const OrderForm = () => {
    const [toggle, setToggle] = useState<boolean>(false);
    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
    const [modalMessage, setModalMessage] = useState<string>('');

    const address = useAppSelector((state) => state.order.address);
    const coordinates = useAppSelector((state) => state.order.coordinates);
    const crews = useAppSelector((state) => state.order.crews);
    const suitableCrew = crews[0];
    const dispatch = useAppDispatch();

    const handleAddressChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setAddress(e.currentTarget.value));
        const result = await window.ymaps.geocode(e.currentTarget.value);
        const firstGeoObject = result.geoObjects.get(0);
        if (firstGeoObject) {
            const coords = firstGeoObject.geometry.getCoordinates();
            dispatch(setCoordinates(coords));
        }
    };

    const handleCrewService = async () => {
        const res = await fetchCrews(coordinates[0],coordinates[1]);
        dispatch(setCrews(res.data.crews_info));
        setToggle(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (address.trim() === '') {
            setModalMessage('Поле "Откуда" обязательно для заполнения');
            setModalIsOpen(true);
            return;
        }

        dispatch(setSourceTime(new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14)));
        if (suitableCrew) {
            try {
                const res = await createOrder(address, coordinates[0], coordinates[1], suitableCrew.crew_id);
                dispatch(setCrewId(suitableCrew.crew_id));
                setModalMessage(`Заказ оформлен! Номер заказа: ${res.data.order_id}`);
            } catch (error) {
                setModalMessage('Ошибка при оформлении заказа.');
            }
        } else {
            setModalMessage('Нет доступных экипажей');
        }
        setModalIsOpen(true);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className='form-row'>
                <label>Откуда:</label>
                <input
                    type="text"
                    id="addressInput"
                    value={address}
                    onChange={handleAddressChange}
                    placeholder="Улица, номер дома"
                    required
                />
                <button type="button" id="searchButton" onClick={handleCrewService}>Найти</button>
            </div>

            <div className='form-row'>
                <span>Подходящий экипаж:</span>
                {toggle && suitableCrew && (
                    <div className='suitable-crew'>
                        <img src={carIcon} alt=""/>
                        <div className='suitable-crew-title'>
                            <span>{suitableCrew.car_mark} {suitableCrew.car_model}</span>
                            <span>{suitableCrew.car_color}</span>
                            <span>{suitableCrew.car_number}</span>
                        </div>
                    </div>
                )}
            </div>
            <div className='map-form'>
                <Map/>
                <CrewList/>
            </div>
            <div className='form-button'>
                <button type="submit">Заказать</button>
            </div>
            <OrderModal
                isOpen={modalIsOpen}
                onRequestClose={() => setModalIsOpen(false)}
                message={modalMessage}
            />
        </form>
    );
};
