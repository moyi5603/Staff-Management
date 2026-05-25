import { useEffect, useMemo, useRef, useState, type MouseEvent as ReactMouseEvent } from 'react';
import { CHINA_REGIONS, getCitiesByProvince, getDistrictsByCity } from '../data/chinaRegions';
import { formatWorkLocation, isWorkLocationComplete, type WorkLocationValue } from '../utils/workLocation';
import styles from './WorkLocationPicker.module.css';

interface Props {
  value: WorkLocationValue;
  onChange: (next: WorkLocationValue) => void;
  placeholder?: string;
}

export function WorkLocationPicker({
  value,
  onChange,
  placeholder = '请选择省 / 市 / 区（县）',
}: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [activeProvince, setActiveProvince] = useState(value.workLocationProvince);
  const [activeCity, setActiveCity] = useState(value.workLocationCity);

  const cities = useMemo(() => getCitiesByProvince(activeProvince), [activeProvince]);
  const districts = useMemo(
    () => getDistrictsByCity(activeProvince, activeCity),
    [activeProvince, activeCity],
  );

  const displayText = isWorkLocationComplete(value) ? formatWorkLocation(value, '') : '';

  useEffect(() => {
    if (!open) return;
    setActiveProvince(value.workLocationProvince || CHINA_REGIONS[0]?.province || '');
    setActiveCity(value.workLocationCity || '');
  }, [open, value.workLocationProvince, value.workLocationCity]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  const handleProvinceEnter = (province: string) => {
    setActiveProvince(province);
    setActiveCity('');
  };

  const handleCityEnter = (city: string) => {
    setActiveCity(city);
  };

  const handleDistrictSelect = (district: string) => {
    if (!activeProvince || !activeCity) return;
    onChange({
      workLocationProvince: activeProvince,
      workLocationCity: activeCity,
      workLocationDistrict: district,
    });
    setOpen(false);
  };

  const handleClear = (e: ReactMouseEvent) => {
    e.stopPropagation();
    onChange({
      workLocationProvince: '',
      workLocationCity: '',
      workLocationDistrict: '',
    });
    setActiveProvince('');
    setActiveCity('');
    setOpen(false);
  };

  return (
    <div className={styles.root} ref={rootRef}>
      <div className={`${styles.triggerWrap} ${open ? styles.triggerWrapOpen : ''}`}>
        <button
          type="button"
          className={styles.trigger}
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-haspopup="listbox"
        >
          <span className={displayText ? styles.value : styles.placeholder}>
            {displayText || placeholder}
          </span>
          <span className={styles.chevron} aria-hidden />
        </button>
        {displayText ? (
          <button
            type="button"
            className={styles.clear}
            aria-label="清空工作地点"
            onClick={handleClear}
          >
            ×
          </button>
        ) : null}
      </div>

      {open && (
        <div className={styles.panel} role="listbox">
          <ul className={styles.column}>
            {CHINA_REGIONS.map((p) => (
              <li key={p.province}>
                <button
                  type="button"
                  className={`${styles.option} ${
                    activeProvince === p.province ? styles.optionActive : ''
                  } ${value.workLocationProvince === p.province ? styles.optionSelected : ''}`}
                  onMouseEnter={() => handleProvinceEnter(p.province)}
                  onFocus={() => handleProvinceEnter(p.province)}
                >
                  {p.province}
                </button>
              </li>
            ))}
          </ul>
          <ul className={styles.column}>
            {activeProvince ? (
              cities.map((c) => (
                <li key={c.city}>
                  <button
                    type="button"
                    className={`${styles.option} ${
                      activeCity === c.city ? styles.optionActive : ''
                    } ${value.workLocationCity === c.city ? styles.optionSelected : ''}`}
                    onMouseEnter={() => handleCityEnter(c.city)}
                    onFocus={() => handleCityEnter(c.city)}
                  >
                    {c.city}
                  </button>
                </li>
              ))
            ) : (
              <li className={styles.hint}>请先选择省份</li>
            )}
          </ul>
          <ul className={styles.column}>
            {activeProvince && activeCity ? (
              districts.map((d) => (
                <li key={d}>
                  <button
                    type="button"
                    className={`${styles.option} ${
                      value.workLocationDistrict === d &&
                      value.workLocationCity === activeCity &&
                      value.workLocationProvince === activeProvince
                        ? styles.optionSelected
                        : ''
                    }`}
                    onClick={() => handleDistrictSelect(d)}
                  >
                    {d}
                  </button>
                </li>
              ))
            ) : (
              <li className={styles.hint}>{activeProvince ? '请选择城市' : '—'}</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
