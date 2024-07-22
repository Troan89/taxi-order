import React, {useState} from 'react';
import {setAddress, setCrewId, setCrews, setSourceTime} from '../store/OrderSlice';
import {useAppDispatch, useAppSelector} from '../store';
import {MapComponent} from "./MapComponent";
import './OrderForm.css'
import carIcon from '../images/car.jpg'
import {CrewList} from "./CrewList";
import {fetchCrews} from "../services/crewService";

export const OrderForm = () => {
    const [toogle, setToggle] = useState<boolean>(false)

    const address = useAppSelector((state) => state.order.address);
    const crews = useAppSelector((state) => state.order.crews.data.crews_info);
    const dispatch = useAppDispatch();

    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setAddress(e.target.value));
    };

    const handleCrewService = () => {
        const crews = fetchCrews()
            .then((res) => (
                setTimeout(() => {
                    dispatch(setCrews(res))
                }, 2000)
            ))
        setToggle(true)
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (address.trim() === '') {
            alert('Поле "Откуда" обязательно для заполнения');
            return;
        }
        dispatch(setSourceTime(new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14)));
        // Mock crew ID
        dispatch(setCrewId(123));
        alert('Заказ оформлен!');
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className='form-row'>
                <label>Откуда:</label>
                <input type="text" id="addressInput" value={address} onChange={handleAddressChange}
                       placeholder="Улица, номер дома" required/>
                <button type="button" id="searchButton" onClick={handleCrewService}>Найти</button>
            </div>

            <div className='form-row'>
                <span>Подходящий экипаж:</span>
                {toogle && <div className='suitable-crew'>
                    <img src={carIcon} alt=""/>
                    <div className='suitable-crew-title'>
                        <span>Chevrolet Lacetti</span>
                        <span>синий</span>
                        <span>Е234КУ</span>
                    </div>
                </div>}
            </div>
            <div className='map-form'>
                <MapComponent/>
                <CrewList/>
            </div>
            <div className='form-button'>
                <button type="submit">Заказать</button>
            </div>
        </form>
    );
};

