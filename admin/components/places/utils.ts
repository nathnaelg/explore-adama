export const getCategoryColorClass = (category: string) => {
     const cat = category?.toLowerCase() || '';
     if (cat.includes('hotel') || cat.includes('stay') || cat.includes('resort')) return 'bg-blue-500';
     if (cat.includes('food') || cat.includes('restaurant') || cat.includes('cafe') || cat.includes('bar')) return 'bg-orange-500';
     if (cat.includes('park') || cat.includes('nature') || cat.includes('garden')) return 'bg-green-500';
     if (cat.includes('museum') || cat.includes('history') || cat.includes('culture') || cat.includes('art')) return 'bg-pink-500';
     if (cat.includes('shop') || cat.includes('mall') || cat.includes('market')) return 'bg-yellow-500';
     if (cat.includes('transport') || cat.includes('station') || cat.includes('airport')) return 'bg-slate-600';
     if (cat.includes('health') || cat.includes('hospital') || cat.includes('clinic')) return 'bg-red-500';
     if (cat.includes('event') || cat.includes('hall') || cat.includes('cinema')) return 'bg-purple-500';
     if (cat.includes('sport') || cat.includes('gym') || cat.includes('stadium')) return 'bg-emerald-600';
     return 'bg-indigo-500';
  };
