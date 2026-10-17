const regions = {forum:['world'], europe:['europe'], welcomehome:['americas','world'], 'telegram-na':['americas'], calendar:['world'], 'europe-2025':['europe'], 'usa-2025':['americas']};
const countries = {'europe-2025':'Belgium Belgique België Belgien Бельгия', 'usa-2025':'USA United States États-Unis Estados Unidos США'};
const normalize = value => value.normalize('NFKD').replace(/\p{M}/gu,'').toLocaleLowerCase().trim();

export function filterDirectory(records, region='all', query='') {
  const terms = normalize(query).split(/\s+/).filter(Boolean);
  return records.filter(record => {
    const scope = regions[record.id] || [];
    const regionMatch = region==='all' || scope.includes(region) || scope.includes('world');
    const text = normalize([record.title,record.region,record.type,record.note,countries[record.id]||''].join(' '));
    return regionMatch && terms.every(term=>text.includes(term));
  });
}
