/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react'

export const BookingContext = createContext(null)

export default function BookingProvider({ children }) {
  const [searchParams, setSearchParams] = useState({
    origin: '',
    destination: '',
    date: '',
    returnDate: '',
    tripType: 'one_way',
  })
  const [forwardLegs, setForwardLegs] = useState([])
  const [selectedForwardLeg, selectForwardLeg] = useState(null)
  const [returnLegs, setReturnLegs] = useState([])
  const [selectedReturnLeg, selectReturnLeg] = useState(null)
  const [selectedHotel, selectHotel] = useState(null)
  const [pricing, setPricing] = useState(null)
  const [bookingId, setBookingId] = useState(null)
  const [refCode, setRefCode] = useState(null)

  const resetBooking = () => {
    setSearchParams({
      origin: '',
      destination: '',
      date: '',
      returnDate: '',
      tripType: 'one_way',
    })
    setForwardLegs([])
    selectForwardLeg(null)
    setReturnLegs([])
    selectReturnLeg(null)
    selectHotel(null)
    setPricing(null)
    setBookingId(null)
    setRefCode(null)
  }

  return (
    <BookingContext.Provider
      value={{
        searchParams,
        setSearchParams,
        forwardLegs,
        setForwardLegs,
        selectedForwardLeg,
        selectForwardLeg,
        returnLegs,
        setReturnLegs,
        selectedReturnLeg,
        selectReturnLeg,
        selectedHotel,
        selectHotel,
        pricing,
        setPricing,
        bookingId,
        setBookingId,
        refCode,
        setRefCode,
        resetBooking,
      }}
    >
      {children}
    </BookingContext.Provider>
  )
}

export const useBooking = () => useContext(BookingContext)
