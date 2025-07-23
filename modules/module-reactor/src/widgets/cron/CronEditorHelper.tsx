export const CronEditorHelper = {
  test: {
    /**
     * Returns true if cron matches Simple minute
     * Example:
     * [* * * * *]
     */
    MINUTE: (cron: string[]) => {
      return cron?.every((item) => item === '*');
    },

    /**
     * Returns true if cron matches Simple hour
     * Example:
     * [19 1/1 * * *]
     */
    HOUR: (cron: string[]) => {
      return (
        CronEditorHelper.isGeneratedMinute(cron[0]) &&
        CronEditorHelper.isEveryUnit(cron[1]) &&
        CronEditorHelper.isWildCard(cron[2]) &&
        CronEditorHelper.isWildCard(cron[3]) &&
        CronEditorHelper.isWildCard(cron[4])
      );
    },

    /**
     * Returns true if cron matches Simple Day
     * Example:
     * [31 1-1 1/1 * *]
     */
    DAY: (cron: string[]) => {
      return (
        CronEditorHelper.isGeneratedMinute(cron[0]) &&
        CronEditorHelper.isRangeValue(cron[1]) &&
        CronEditorHelper.isEveryUnit(cron[2]) &&
        CronEditorHelper.isWildCard(cron[3]) &&
        CronEditorHelper.isWildCard(cron[4])
      );
    },

    /**
     * Returns true if cron matches Simple Weekday (Monday - Friday)
     * Example:
     * [8 1-1 1/1 * MON-FRI]
     */
    WEEKDAY: (cron: string[]) => {
      return (
        CronEditorHelper.isGeneratedMinute(cron[0]) &&
        CronEditorHelper.isRangeValue(cron[1]) &&
        CronEditorHelper.isEveryUnit(cron[2]) &&
        CronEditorHelper.isWildCard(cron[3]) &&
        CronEditorHelper.isWeekday(cron[4])
      );
    },

    /**
     * Returns true if cron matches Simple WEEK
     * Example:
     * [55 1-1 1/1 * MON]
     */
    WEEK: (cron: string[]) => {
      return (
        CronEditorHelper.isGeneratedMinute(cron[0]) &&
        CronEditorHelper.isRangeValue(cron[1]) &&
        CronEditorHelper.isEveryUnit(cron[2]) &&
        CronEditorHelper.isWildCard(cron[3]) &&
        CronEditorHelper.isDayOfWeek(cron[4])
      );
    },

    /**
     * Returns true if cron matches Simple Month
     * Example:
     * [12 1-1 1 * *]
     */
    MONTH: (cron: string[]) => {
      return (
        CronEditorHelper.isGeneratedMinute(cron[0]) &&
        CronEditorHelper.isRangeValue(cron[1]) &&
        CronEditorHelper.isDayOfMonth(cron[2]) &&
        CronEditorHelper.isWildCard(cron[3]) &&
        CronEditorHelper.isWildCard(cron[4])
      );
    }
  },

  isGeneratedMinute: (minute_value) => {
    return Number(minute_value) > 0 && Number(minute_value) < 60;
  },

  isWildCard: (value) => {
    return value === '*';
  },

  isStepValue: (value) => {
    return value.includes('/');
  },

  isRangeValue: (value) => {
    return value.includes('-');
  },

  isEveryUnit: (value) => {
    return value === '1/1';
  },

  isWeekday: (value) => {
    return value === 'MON-FRI';
  },

  isDayOfWeek: (value) => {
    return ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].includes(value);
  },

  isDayOfMonth: (value) => {
    return Number(value) > 0 && Number(value) < 31;
  },

  getHour: (value) => {
    return value[1]?.split('-')[0];
  }
};
