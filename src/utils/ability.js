import { Ability } from '@casl/ability';

// Defines how to detect object's type
function subjectName(item) {
  if (!item || typeof item === 'string') {
    return item;
  }
  return item.type;
}

const ability = new Ability([], { subjectName });
export default ability;
