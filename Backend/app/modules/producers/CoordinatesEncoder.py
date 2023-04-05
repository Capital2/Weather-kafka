from typing import Tuple

# Example: (125.2223, -225.333) ===> P125D2223TN225D333
class CoordinatesEncoder:

    @staticmethod
    def encode(latitude: float, longitude: float) -> str:
        lat = 'P' if latitude >= 0 else 'N'
        long = 'P' if longitude >= 0 else 'N'
        latitude, longitude = abs(latitude), abs(longitude)
        lat += str(latitude)
        long += str(longitude)
        if '.' in lat:
            lat = lat.replace('.', 'D')
        else: # ensure that the decimal part is always present
            lat += 'D0'
        if '.' in long:
            long = long.replace('.', 'D')
        else:
            long += 'D0'
        return f'{lat}T{long}'

    @staticmethod
    def decode(encoded: str) -> Tuple[float, float]:
        lat, long = encoded.split('T')
        latitude = float(lat[1:].replace('D', '.'))
        longitude = float(long[1:].replace('D', '.'))
        if lat[0] == 'N':
            latitude *= -1
        if long[0] == 'N':
            longitude *= -1
        return (latitude, longitude)
    
