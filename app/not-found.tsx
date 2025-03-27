// app/not-found.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import {ArrowLeft, Home} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {Card, CardContent} from '@/components/ui/card';

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8"
             style={{backgroundColor: 'hsl(42, 46%, 94%)'}}>
            <Card className="w-full max-w-3xl border-none bg-white/50 backdrop-blur-sm shadow-lg">
                <CardContent className="p-6 md:p-10 flex flex-col items-center text-center">
                    <div className="mb-8 w-full max-w-md">
                        <SaplingSVG/>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-bold mb-4"
                        style={{color: 'hsl(149, 41%, 39%)'}}>
                        Page Not Found
                    </h1>

                    <p className="text-lg md:text-xl mb-8"
                       style={{color: 'hsl(32, 32%, 41%)'}}>
                        Oops! Mother Nature seems to have misplaced this page.
                        {"Let's guide you back to a greener pasture."}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md justify-center">
                        <Button
                            asChild
                            size="lg"
                            className="gap-2 font-medium"
                            style={{
                                backgroundColor: 'hsl(148, 58%, 55%)',
                                color: 'white',
                            }}
                        >
                            <Link href="/">
                                <Home className="h-5 w-5"/>
                                Return to Nature
                            </Link>
                        </Button>

                        <Button
                            onClick={() => window.history.back()}
                            variant="outline"
                            size="lg"
                            className="gap-2 font-medium"
                            style={{
                                borderColor: 'hsl(138, 49%, 70%)',
                                color: 'hsl(149, 41%, 39%)',
                            }}
                        >
                            <ArrowLeft className="h-5 w-5"/>
                            Go Back
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}


function SaplingSVG() {
    return (
        <svg viewBox="0 0 500 300" width="100%" height="100%" style={{maxWidth: '400px'}}>

            <circle cx="250" cy="150" r="130" fill="hsl(138, 49%, 70%, 0.3)"/>
            <circle cx="250" cy="150" r="100" fill="hsl(148, 58%, 55%, 0.2)"/>


            <ellipse cx="250" cy="150" rx="70" ry="80" fill="hsl(32, 32%, 41%, 0.15)" stroke="hsl(32, 32%, 41%)"
                     strokeWidth="1.5"/>


            <path
                d="M180,120 C170,100 170,80 190,70 C210,60 230,80 250,70 C270,60 290,60 310,70 C330,80 330,100 320,120"
                fill="hsl(148, 58%, 55%)" stroke="hsl(149, 41%, 39%)" strokeWidth="1.5"/>


            <path d="M200,110 C210,120 220,110 230,120 C240,130 260,130 270,120 C280,110 290,120 300,110"
                  fill="hsl(148, 58%, 55%)" stroke="hsl(149, 41%, 39%)" strokeWidth="1.5"/>


            <path d="M220,70 C215,50 220,30 230,40 C240,50 235,70 230,80"
                  fill="hsl(32, 32%, 41%)" stroke="hsl(32, 32%, 41%)" strokeWidth="1"/>
            <path d="M280,70 C285,50 280,30 270,40 C260,50 265,70 270,80"
                  fill="hsl(32, 32%, 41%)" stroke="hsl(32, 32%, 41%)" strokeWidth="1"/>

            <path d="M225,140 C230,138 235,138 240,140" stroke="hsl(32, 32%, 41%)" strokeWidth="2" fill="none"/>
            <path d="M260,140 C265,138 270,138 275,140" stroke="hsl(32, 32%, 41%)" strokeWidth="2" fill="none"/>

            <path d="M240,160 C245,158 255,158 260,160" stroke="hsl(32, 32%, 41%)" strokeWidth="2" fill="none"/>

            <path d="M150,180 C170,160 180,190 170,210" stroke="hsl(149, 41%, 39%)" strokeWidth="2"
                  fill="hsl(148, 58%, 55%, 0.6)"/>
            <path d="M350,180 C330,160 320,190 330,210" stroke="hsl(149, 41%, 39%)" strokeWidth="2"
                  fill="hsl(148, 58%, 55%, 0.6)"/>

            <text
                x="250"
                y="220"
                fontFamily="Arial, sans-serif"
                fontSize="60"
                fontWeight="bold"
                fill="hsl(149, 41%, 39%)"
                textAnchor="middle"
                dominantBaseline="middle"
            >
                404
            </text>

            <circle cx="170" cy="210" r="8" fill="hsl(138, 49%, 70%)"/>
            <circle cx="330" cy="210" r="8" fill="hsl(138, 49%, 70%)"/>

            <path d="M100,250 C150,240 200,245 250,240 C300,245 350,240 400,250"
                  fill="hsl(148, 58%, 55%, 0.3)" stroke="hsl(149, 41%, 39%)" strokeWidth="1"/>
        </svg>
    );
}