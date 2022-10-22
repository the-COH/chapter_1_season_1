import { Facet } from './facet';

// Find a particular address position in the return value of diamondLoupeFacet.facets()
export const findAddressPositionInFacets = (facetAddress: string, facets: Facet[]): number =>
	facets.findIndex((facet) => facet.facetAddress === facetAddress);
