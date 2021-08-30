import { UserProfile, withPageAuthRequired } from '@auth0/nextjs-auth0';
import { PomorodoTimer } from '@prisma/client';
import axios from 'axios';
import clsx from 'clsx';
import DashboardLayout from 'layouts/DashboardLayout';
import { useState } from 'react';
import { useEffect } from 'react';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import toast from 'react-hot-toast';
import { BiFootball, BiTargetLock } from 'react-icons/bi';
import useSWR from 'swr';

const Page: React.FC<{ user: UserProfile }> = ({ user }) => {
  const [isBreakActive, setIsBreakActive] = useState(false);
  const [isSessionActive, setIsSessionActive] = useState(true);
  const [isBreakTimerActive, setIsBreakTimerActive] = useState(false);
  const [isSessionTimerActive, setIsSessionTimerActive] = useState(true);
  const [isBreakPaused, setIsBreakPaused] = useState(false);
  const [isSessionPaused, setIsSessionPaused] = useState(true);
  const [isStartBtnDisabled, setIsStartBtnDisabled] = useState(false);

  const { sub } = user;

  const { data: pointsData, mutate } = useSWR<PomorodoTimer>(
    '/api/pomorodo/get-points'
  );

  return (
    <DashboardLayout>
      <div className='text-center'>
        <h1 className='mb-20 text-4xl font-extrabold mt-14'>Pomorodo timer</h1>
        <div className='flex items-center justify-around w-full max-w-md mx-auto my-5'>
          <div className='text-2xl font-bold text-center'>
            {isBreakActive
              ? 'Time to take a break for 5 mins!!'
              : 'Time to focus on your work!!'}
          </div>
        </div>
        <div className='flex justify-center w-full max-w-3xl mx-auto'>
          {isSessionActive && (
            <CountdownCircleTimer
              trailColor='transparent'
              strokeWidth={18}
              isPlaying={!isSessionPaused}
              onComplete={() => {
                setIsSessionActive(false);
                setIsBreakActive(true);
                setIsBreakTimerActive(true);
              }}
              rotation='counterclockwise'
              duration={25 * 60}
              size={230}
              colors={[['#50E3C2', 1]]}>
              {({ remainingTime }) => {
                // render remaining time in minutes and seconds
                const minutes = Math.floor(remainingTime / 60);
                const seconds = Math.floor(remainingTime % 60);
                return (
                  <div>
                    <p className='text-5xl font-bold text-black'>
                      {minutes < 10 ? `0${minutes}` : minutes}:
                      {seconds < 10 ? `0${seconds}` : seconds}
                    </p>
                  </div>
                );
              }}
            </CountdownCircleTimer>
          )}
          {isBreakActive && (
            <CountdownCircleTimer
              trailColor='transparent'
              strokeWidth={18}
              isPlaying={!isBreakPaused}
              onComplete={() => {
                axios.post('/api/pomorodo/add-point').then(() => {
                  mutate({ ...pointsData, points: pointsData?.points + 1 });
                });
                toast(
                  <div>
                    <p>You completed a Pomorodo session successfully 🥳 🎉</p>
                    <p>And you have been given a point for this!</p>
                    <p>Start a pomorodo if you want an other one.</p>
                  </div>,
                  {
                    duration: 10 * 60 * 1000,
                  }
                );
              }}
              rotation='counterclockwise'
              duration={5 * 60}
              size={230}
              colors={[['#3291FF', 1]]}>
              {({ remainingTime }) => {
                // render remaining time in minutes and seconds
                const minutes = Math.floor(remainingTime / 60);
                const seconds = Math.floor(remainingTime % 60);
                return (
                  <div>
                    <p className='text-5xl font-bold text-black'>
                      {minutes < 10 ? `0${minutes}` : minutes}:
                      {seconds < 10 ? `0${seconds}` : seconds}
                    </p>
                  </div>
                );
              }}
            </CountdownCircleTimer>
          )}
        </div>
        <div className='mt-16'>
          <button
            className={clsx(
              'px-5 py-2 my-8 mr-3 bg-gray-900 rounded shadow text-gray-50',
              isStartBtnDisabled && 'opacity-50 cursor-not-allowed'
            )}
            onClick={() => {
              setIsSessionPaused(false);
              setIsStartBtnDisabled(true);
            }}>
            Start this session
          </button>
          <button
            className='px-5 py-2 my-8 mr-3 bg-gray-900 rounded shadow text-gray-50'
            onClick={() => {
              window.location.reload();
            }}>
            Start a new pomodoro session
          </button>
          <button
            className='px-5 py-2 my-8 bg-gray-900 rounded shadow text-gray-50'
            onClick={() => {
              if (isSessionActive) {
                setIsSessionPaused(!isSessionPaused);
              } else if (isBreakActive) {
                setIsBreakPaused(!isBreakPaused);
              }
            }}>
            Pause/resume
          </button>
        </div>
        <div className='mt-10'>
          <p className='text-base text-gray-700'>
            You have gained {pointsData?.points ? pointsData?.points : 'no'}{' '}
            {pointsData?.points === 1 ? 'point' : 'points'} by completing
            Pomorodo sessions.
          </p>
          <p className='text-sm text-gray-700'>
            You can get more points by completing more Pomorodo sessions.
          </p>
          <p className='mt-2 text-gray-'>
            Last pomorodo session taken at{' '}
            {pointsData?.updatedAt
              ? new Date(pointsData?.updatedAt).toLocaleString()
              : '¯\\_(ツ)_/¯'}
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default withPageAuthRequired(Page);
