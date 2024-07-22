import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface OrderState {
    address: string;
    coordinates: number[];
    sourceTime: string;
    crewId: number;
    crews: Crews_info[];
}

type Crews_info = {
    crew_id: number
    car_mark: string
    car_model: string
    car_color: string
    car_number: string
    driver_name: string
    driver_phone: string
    lat: number
    lon: number
    distance: number
}

const initialState: OrderState = {
    address: '',
    coordinates: [0, 0],
    sourceTime: '',
    crewId: 0,
    crews: []

};

const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        setAddress(state, action: PayloadAction<string>) {
            state.address = action.payload;
        },
        setCoordinates(state, action: PayloadAction<number[]>) {
            state.coordinates = action.payload;
        },
        setSourceTime(state, action: PayloadAction<string>) {
            state.sourceTime = action.payload;
        },
        setCrewId(state, action: PayloadAction<number>) {
            state.crewId = action.payload;
        },
        setCrews(state, action: PayloadAction<Crews_info[]>) {
            state.crews = action.payload;
            state.crews.sort((a, b) => a.distance - b.distance)
        }
    }
});

export const { setAddress,
    setCoordinates,
    setSourceTime,
    setCrewId,
    setCrews } = orderSlice.actions;

export const orderReducer = orderSlice.reducer;
