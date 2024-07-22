import React from 'react';
import './CrewList.css'
import carIcon from "../images/car.jpg";
import {useAppSelector} from "../store";

export const CrewList = () => {
    const crews = useAppSelector((state) => state.order.crews.data.crews_info);

    return (
        <div className="crews-list">
            {crews.length === 0 ? (
                <p>Экипажи не найдены</p>
            ) : (
                <table className='crews-list-form'>
                    {crews.map((crew) => (
                        <tr className='crew-list-form' key={crew.crew_id}>
                            <td className='crew-list-form-icon'>
                                <img src={carIcon} alt=""/>
                            </td>
                            <td className='crew-list-form-title'>
                                <strong>{crew.car_mark} {crew.car_model}</strong>
                                <span>{crew.car_color}</span>
                            </td>
                            <td className='crew-list-form-distance'>
                                <span>{crew.distance} м</span>
                            </td>
                        </tr>
                    ))}
                </table>
            )}
        </div>
    );
};

