import { RRule, RRuleSet, rrulestr } from 'rrule';
import { refineProps, createDuration, createPlugin } from '@fullcalendar/core';
import _ from 'lodash';

const EVENT_DEF_PROPS = {
  rruleSet: null,
  duration: createDuration,
};
const recurring = {
  parse(rawEvent, leftoverProps, dateEnv) {
    if (rawEvent.rruleSet != null) {
      const props = refineProps(rawEvent, EVENT_DEF_PROPS, {}, leftoverProps);
      const parsed = parseRRuleSet(props.rruleSet, dateEnv);
      if (parsed) {
        return {
          typeData: parsed.rruleSet,
          allDayGuess: parsed.allDayGuess,
          duration: props.duration,
        };
      }
    }
    return null;
  },
  expand(rruleSet) {
    return rruleSet.all();
  },
};
export default createPlugin({
  recurringTypes: [recurring],
});
function parseRRuleSet(input, dateEnv) {
  let allDayGuess = null;
  let rruleSet;
  if (typeof input === 'string') {
    rruleSet = rrulestr(input);
  } else if (typeof input === 'object' && input) {
    // non-null object
    const refined = _.assign({}, input); // copy
    const excludes = refined.exrules;
    delete refined.exrules;
    if (typeof refined.dtstart === 'string') {
      const dtstartMeta = dateEnv.createMarkerMeta(refined.dtstart);
      if (dtstartMeta) {
        refined.dtstart = dtstartMeta.marker;
        allDayGuess = dtstartMeta.isTimeUnspecified;
      } else {
        delete refined.dtstart;
      }
    }
    if (typeof refined.until === 'string') {
      refined.until = dateEnv.createMarker(refined.until);
    }
    if (refined.freq != null) {
      refined.freq = convertConstant(refined.freq);
    }
    if (refined.wkst != null) {
      refined.wkst = convertConstant(refined.wkst);
    } else {
      refined.wkst = (dateEnv.weekDow - 1 + 7) % 7; // convert Sunday-first to Monday-first
    }
    if (refined.byweekday != null) {
      refined.byweekday = convertConstants(refined.byweekday); // the plural version
    }
    rruleSet = new RRuleSet(true);
    rruleSet.rrule(new RRule(refined));
    if (Array.isArray(excludes) && excludes.length > 0) {
      // eslint-disable-next-line no-plusplus
      for (let i = excludes.length - 1; i >= 0; i--) {
        rruleSet.exdate(new Date(excludes[i]));
      }
    }
  }
  if (rruleSet) {
    return { rruleSet, allDayGuess };
  }
  return null;
}
function convertConstants(input) {
  if (Array.isArray(input)) {
    return input.map(convertConstant);
  }
  return convertConstant(input);
}
function convertConstant(input) {
  if (typeof input === 'string') {
    return RRule[input.toUpperCase()];
  }
  return input;
}
