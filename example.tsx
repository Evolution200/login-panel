export enum ClaimType{
    observeName = 'observation',
    reasonName = 'reason',
    predictName = 'predict',
}

export const claimTypeList = Object.values(ClaimType)

export function getClaimType(newType:string){
    return claimTypeList.filter(a => a === newType)
}