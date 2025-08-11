import { Transform } from 'class-transformer';

export const ToBoolean = () =>
    Transform(({ value }) => {
        if (typeof value === 'boolean') return value;
        if (typeof value === 'number') return value === 1;
        if (typeof value === 'string') {
            const v = value.trim().toLowerCase();
            if (['true', '1', 'yes', 'on'].includes(v)) return true;
            if (['false', '0', 'no', 'off'].includes(v)) return false;
        }
        return value;
    });
