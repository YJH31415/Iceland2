export function wetDepositionRate(precipMmH,coeff){return Math.max(0,coeff*precipMmH/3600)}
export function applyDeposition(m,dt,rate){return m*Math.exp(-Math.max(0,rate)*dt)}