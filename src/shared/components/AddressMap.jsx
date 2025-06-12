import React, { useState } from 'react';
import { YMaps, Map, Placemark, SearchControl } from '@pbe/react-yandex-maps';
import styles from './AddressMap.module.css';

const AddressMap = ({ onAddressSelect }) => {
    const [ymaps, setYmaps] = useState(null);
    const [selectedCoords, setSelectedCoords] = useState(null);
    const [selectedAddress, setSelectedAddress] = useState(null);

    const handleClick = async (e) => {
        const coords = e.get('coords');
        setSelectedCoords(coords);

        if (ymaps) {
            try {
                const res = await ymaps.geocode(coords);
                const firstGeoObject = res.geoObjects.get(0);
                const address = firstGeoObject.getAddressLine();
                setSelectedAddress(address);
                onAddressSelect(address);
            } catch (error) {
                console.error('Ошибка при получении адреса:', error);
            }
        }
    };

    return (
        <div className={styles.mapContainer}>
            <YMaps
                query={{
                    apikey: '677a08d7-ee32-41d6-bb97-18924d9010b5',
                    load: 'package.full',
                    lang: 'ru_RU',
                }}
            >
                <Map
                    defaultState={{
                        center: [55.75, 37.57],
                        zoom: 9,
                    }}
                    width="100%"
                    height="400px"
                    onLoad={(ymapsInstance) => {
                        setYmaps(ymapsInstance);
                    }}
                    onClick={handleClick}
                    modules={['geocode', 'SuggestView']}
                    options={{
                        suppressMapOpenBlock: true
                    }}
                >
                    <SearchControl
                        options={{
                            float: 'right',
                            provider: 'yandex#search',
                            suppressYandexSearch: false,
                            useMapBounds: true
                        }}
                    />
                    {selectedCoords && (
                        <Placemark
                            geometry={selectedCoords}
                            properties={{
                                balloonContent: selectedAddress || 'Выбранная точка',
                            }}
                        />
                    )}
                </Map>
            </YMaps>
            {selectedAddress && (
                <div className={styles.selectedAddress}>
                    <p>Выбранный адрес: {selectedAddress}</p>
                </div>
            )}
        </div>
    );
};

export default AddressMap; 