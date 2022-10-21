import React, { useState } from 'react';
import { usePrepareContractWrite, useContractWrite } from "wagmi"
import { CONTRACT_ADDRESS } from "~/constants"

const TWO_PARTY_ABI = require("~/constants/TwoPartyContract.json")

const Create = () => {
  const [description, setDescription] = useState<string>()
  const [ipfsHash, setIpfsHash] = useState<string>()
  const [signerName, setSignerName] = useState<string>()
  const [counterpartyName, setCounterpartyName] = useState<string>()
  const [counterpartyAddress, setCounterpartyAddress] = useState<string>()

  const { config, error } = usePrepareContractWrite({
    address: CONTRACT_ADDRESS,
    abi: TWO_PARTY_ABI,
    functionName: 'createTwoPartyContract',
    args: [description, signerName, counterpartyAddress, counterpartyName, ipfsHash],
  });
  const { write } = useContractWrite(config);
  
  // TODO: Infura IPFS upload here 
  const handleFile = async (e) => {
    const file = e.target.files[0] 

    // TODO: Add pdf and size validation here 
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('https://ipfs.infura.io:5001/api/v0/add', {
      method: 'POST',
      body: formData,
      headers: {
        infura_api_key: process.env.NEXT_PUBLIC_INFURA_API_KEY,
        infura_secret_api_key: process.env.NEXT_PUBLIC_INFURA_API_SECRET,
      },
    });
    const data = await response.json();

    setIpfsHash(data.IpfsHash);
  }

  console.log('error', error)

  return (
    <form className="space-y-6">
      <div className="bg-brand-500 px-4 py-5 shadow sm:rounded-lg sm:p-6">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <h3 className="text-lg font-medium leading-6 text-zinc-50">Agreement</h3>
            <p className="mt-1 text-sm text-zinc-400">
              This information will be displayed publicly so be careful what you share.
            </p>
          </div>
          <div className="mt-5 space-y-6 md:col-span-2 md:mt-0">
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-zinc-200">
                Description
              </label>
              <div className="mt-1">
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  className="block w-full rounded-md border-zinc-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm"
                  placeholder="This contract is for..."
                  defaultValue={''}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <p className="mt-2 text-sm text-zinc-400">Brief description for your contract.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-200">Agreement</label>
              <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-zinc-300 px-6 pt-5 pb-6">
                {/* TODO: Add Agreement SVG */}
                <div className="space-y-1 text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-zinc-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="flex text-sm text-zinc-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer rounded-md bg-zinc-50 p-1 font-medium text-brand-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-brand-500 focus-within:ring-offset-2 hover:text-brand-500"
                    >
                      <span>Upload a file</span>
                      <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFile} />
                    </label>
                    {/* <p className="pl-1">or drag and drop</p> */}
                  </div>
                  <p className="text-xs text-zinc-400">PDF upto 25MB</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-brand-500 px-4 py-5 shadow sm:rounded-lg sm:p-6">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <h3 className="text-lg font-medium leading-6 text-zinc-50">Signer Information</h3>
            <p className="mt-1 text-sm text-zinc-400"> This information will be displayed publicly so be careful what you share.</p>
          </div>
          <div className="mt-5 md:col-span-2 md:mt-0">
            <div className="grid grid-cols-6 gap-6">
              <div className="col-span-6 sm:col-span-4">
                <label htmlFor="email-address" className="block text-sm font-medium text-zinc-200">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  className="mt-1 block w-full rounded-md border-zinc-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm"
                  onChange={(e) => setSignerName(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-brand-500 px-4 py-5 shadow sm:rounded-lg sm:p-6">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <h3 className="text-lg font-medium leading-6 text-zinc-50">Counterparty Information</h3>
            <p className="mt-1 text-sm text-zinc-400"> This information will be displayed publicly so be careful what you share.</p>
          </div>
          <div className="mt-5 md:col-span-2 md:mt-0">
            <div className="grid grid-cols-6 gap-6">
              <div className="col-span-6 sm:col-span-4">
                <label htmlFor="counter_name" className="block text-sm font-medium text-zinc-200">
                  Name
                </label>
                <input
                  type="text"
                  name="counter_name"
                  id="counter_name"
                  className="mt-1 block w-full rounded-md border-zinc-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm"
                  onChange={(e) => setCounterpartyName(e.target.value)}
                />
              </div>
              <div className="col-span-6 sm:col-span-4">
                <label htmlFor="counter_address" className="block text-sm font-medium text-zinc-200">
                  Address
                </label>
                <input
                  type="text"
                  name="counter_address"
                  id="counter_address"
                  className="mt-1 block w-full rounded-md border-zinc-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm"
                  onChange={(e) => setCounterpartyAddress(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-end">
        <button
          type="button"
          disabled={!write}
          onClick={() => write?.()}
          className="rounded-md border border-brand-300 bg-brand-600 py-2 px-4 text-sm font-medium text-zinc-200 shadow-sm hover:bg-brand-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
        >
          Submit
        </button>
      </div>
    </form>
  )
}

export default Create
