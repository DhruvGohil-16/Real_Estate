import {
    Footer,
    FooterBrand,
    FooterCopyright,
    FooterDivider,
    FooterIcon,
    FooterLink,
    FooterLinkGroup,
    FooterTitle
  } from "flowbite-react"
  import {
    BsDribbble,
    BsFacebook,
    BsGithub,
    BsInstagram,
    BsTwitter
  } from "react-icons/bs"
  
  import React from 'react'
  
  export default function MyFooter() {
    return (
        <Footer container className="bg-gray-300">
            <div className="w-full">
                <div className="grid w-full sm:flex sm:justify-between md:flex md:grid-cols-2">
                    <div className="flex flex-col my-4 w-1/3">
                        <FooterBrand
                            href="/"
                            src="../favicon.ico"
                            alt="DrEstate Logo"
                            name="DrEstate"
                            className="mb-2 text-gray-500"
                        />
                        <p className='my-4 text-gray-700'>Dr Estate is a leading real estate agency that specializes in helping clients buy, sell, and rent properties in the most desirable neighborhoods.</p>
                        <p className='text-gray-700'> Our team of experienced agents is dedicated to providing exceptional service and making the buying and selling process as smooth as possible.</p>
                    </div>
                    <div> 
                        <div className="grid justify-center grid-cols-2 gap-8 sm:mt-4 sm:grid-cols-3 sm:gap-6">
                            <div>
                                <FooterTitle title="about" className="text-gray-700"/>
                                <FooterLinkGroup col>
                                <FooterLink href="#" className="text-gray-800">Dr.Estate</FooterLink>
                                <FooterLink href="#" className="text-gray-700">Estate's Group</FooterLink>
                                </FooterLinkGroup>
                            </div>
                            <div>
                                <FooterTitle title="Follow us" className="text-gray-800"/>
                                <FooterLinkGroup col>
                                <FooterLink href="#" className="text-gray-700">LinkedIn</FooterLink>
                                <FooterLink href="#" className="text-gray-700">Twitter</FooterLink>
                                <FooterLink href="#" className="text-gray-700">Instagram</FooterLink>
                                <FooterLink href="#" className="text-gray-700">Facebook</FooterLink>
                                </FooterLinkGroup>
                            </div>
                            <div>
                                <FooterTitle title="Legal" className="text-gray-800"/>
                                <FooterLinkGroup col>
                                <FooterLink href="#" className="text-gray-700">Privacy Policy</FooterLink>
                                <FooterLink href="#" className="text-gray-700">Terms &amp; Conditions</FooterLink>
                                </FooterLinkGroup>
                            </div>
                        </div>
                    </div>
                </div>
                <FooterDivider/>
                <div className="w-full sm:flex sm:items-center sm:justify-between">
                    <FooterCopyright href="/" by="DrEstate™" year={2024} className="text-gray-800"/>
                    <div className="mt-4 flex space-x-8 sm:mt-0 sm:justify-center">
                        <FooterIcon href="#" icon={BsFacebook} />
                        <FooterIcon href="#" icon={BsInstagram} />
                        <FooterIcon href="#" icon={BsTwitter} />
                        <FooterIcon href="#" icon={BsGithub} />
                        <FooterIcon href="#" icon={BsDribbble} />
                    </div>
                </div>
            </div>
        </Footer>
    )
  }