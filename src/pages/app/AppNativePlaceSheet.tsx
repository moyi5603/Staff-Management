import { useEffect, useMemo, useState } from 'react';
import { CHINA_REGIONS, getCitiesByProvince } from '../../data/chinaRegions';
import styles from './AppNativePlaceSheet.module.css';

interface Props {
  value: string;
  onConfirm: (value: string) => void;
  onClose: () => void;
}

function parseNativePlace(value: string): { province: string; city: string } {
  if (!value.trim()) return { province: '', city: '' };
  for (const region of CHINA_REGIONS) {
    if (value.startsWith(region.province)) {
      const rest = value.slice(region.province.length);
      const cities = getCitiesByProvince(region.province);
      const matchedCity = cities.find((c) => rest.startsWith(c.city));
      if (matchedCity) {
        return { province: region.province, city: matchedCity.city };
      }
      return { province: region.province, city: '' };
    }
  }
  return { province: '', city: '' };
}

export function AppNativePlaceSheet({ value, onConfirm, onClose }: Props) {
  const parsed = useMemo(() => parseNativePlace(value), [value]);
  const [province, setProvince] = useState(parsed.province || CHINA_REGIONS[0]?.province || '');
  const [city, setCity] = useState(parsed.city);

  const cities = useMemo(() => getCitiesByProvince(province), [province]);

  useEffect(() => {
    setProvince(parsed.province || CHINA_REGIONS[0]?.province || '');
    setCity(parsed.city);
  }, [parsed.province, parsed.city]);

  const preview =
    province && city ? `${province}${city}` : province ? `${province}（请选择城市）` : '请选择籍贯';

  const handleConfirm = () => {
    if (!province || !city) return;
    onConfirm(`${province}${city}`);
    onClose();
  };

  return (
    <div className={styles.overlay} role="presentation" onClick={onClose}>
      <div
        className={styles.sheet}
        role="dialog"
        aria-modal="true"
        aria-labelledby="native-place-sheet-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.header}>
          <button type="button" className={`${styles.btn} ${styles.cancel}`} onClick={onClose}>
            取消
          </button>
          <span id="native-place-sheet-title" className={styles.title}>
            选择籍贯
          </span>
          <button
            type="button"
            className={`${styles.btn} ${styles.confirm}`}
            onClick={handleConfirm}
            disabled={!province || !city}
          >
            完成
          </button>
        </div>
        <div className={styles.picker}>
          <div className={styles.column}>
            {CHINA_REGIONS.map((r) => (
              <button
                key={r.province}
                type="button"
                className={`${styles.item} ${province === r.province ? styles.itemActive : ''}`}
                onClick={() => {
                  setProvince(r.province);
                  setCity('');
                }}
              >
                {r.province}
              </button>
            ))}
          </div>
          <div className={styles.column}>
            {cities.map((c) => (
              <button
                key={c.city}
                type="button"
                className={`${styles.item} ${city === c.city ? styles.itemActive : ''}`}
                onClick={() => setCity(c.city)}
              >
                {c.city}
              </button>
            ))}
          </div>
        </div>
        <p className={styles.preview}>{preview}</p>
      </div>
    </div>
  );
}
