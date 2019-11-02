import _,{ startsWith, chain, split, camelCase } from 'lodash';

export function orderBuilder (params) {
  let sorting = 'ASC';
  let orderBy = params;

  if (startsWith(orderBy, '-')) {
    sorting = 'DESC';
    //remove char -
    orderBy = orderBy.substring(1);
  }

  return chain(split(orderBy,','))
  .map(x => {
    if (x == 'priority') return ['id', sorting];
    return [
      camelCase(x),
      sorting
    ];
  })
  .value();
}
