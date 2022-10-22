import { Facet } from './facet';

export namespace FacetCut {
	export enum Action {
		Add = 0,
		Replace = 1,
		Remove = 2,
	}
}

export type FacetCut = Facet & {
	name?: string,
	action: FacetCut.Action;
	signatures?: string[],
}
