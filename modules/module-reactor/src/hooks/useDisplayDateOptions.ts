import { DateDisplayWidgetProps } from '../widgets';
import { DateFormatPreference } from '../preferences/DateFormatPreference';
import { useForceUpdate } from './useForceUpdate';
import { useEffect } from 'react';
import { DateLocalSetting } from '../preferences/DateLocalSetting';
import { DateShowZoneSetting } from '../preferences/DateShowZoneSetting';

export const useDisplayDateOptions = () => {
  let forceUpdate = useForceUpdate();
  let control_format = DateFormatPreference.get();
  let control_local = DateLocalSetting.get();
  let control_zone = DateShowZoneSetting.get();

  [control_local, control_format, control_zone].forEach((c) => {
    useEffect(() => {
      return c.registerListener({
        updated: () => {
          forceUpdate();
        }
      });
    }, []);
  });

  return {
    format: control_format.asFormat,
    local: control_local.checked,
    zone: control_zone.checked
  } as Omit<DateDisplayWidgetProps, 'date'>;
};
