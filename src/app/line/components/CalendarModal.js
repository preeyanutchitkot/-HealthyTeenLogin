'use client';

import * as React from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/th';
import { Dialog, DialogContent, DialogActions, Button } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';

dayjs.locale('th');

export default function CalendarModal({
  open,
  onClose,
  value,
  onChange,
  onConfirm,
}) {
  const [temp, setTemp] = React.useState(value ?? dayjs());

  React.useEffect(() => {
    setTemp(value ?? dayjs());
  }, [value, open]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: 'hidden',
          // เงานุ่ม ๆ คล้ายรูป
          boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
        },
      }}
    >
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="th">
        <DialogContent sx={{ p: 0 }}>
          <StaticDatePicker
            displayStaticWrapperAs="desktop"
            value={temp}
            onChange={(d) => setTemp(d)}
            slotProps={{
              actionBar: { actions: [] }, // ไม่ต้องแสดงปุ่มในตัว picker
            }}
          />
        </DialogContent>

        <DialogActions sx={{ px: 2, pb: 1.5 }}>
          <Button onClick={onClose} variant="text">
            Cancel
          </Button>
          <Button
            onClick={() => {
              onChange?.(temp);
              onConfirm?.(temp);
            }}
            variant="text"
          >
            OK
          </Button>
        </DialogActions>
      </LocalizationProvider>
    </Dialog>
  );
}
