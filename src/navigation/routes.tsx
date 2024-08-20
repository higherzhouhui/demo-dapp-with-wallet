import type { ComponentType, JSX } from 'react';

import IndexPage from '@/pages/Index';
import EmjoyGamepAGE from '@/pages/EmjoyGame';
import LeaderBoardPage from '@/pages/LeaderBoard';
import FrensPage from '@/pages/Frens';
import GamePage from '@/pages/Game';

interface Route {
  path: string;
  Component: ComponentType;
  title?: string;
  icon?: JSX.Element;
}

function Tab() {
  return <div style={{ color: 'red', width: '100vw', height: '100vh', position: 'fixed' }}>1111</div>
}

export const routes: Route[] = [
  { path: '/', Component: IndexPage },
  { path: '/emjoyGame', Component: EmjoyGamepAGE },
  { path: '/leaderBoard', Component: LeaderBoardPage },
  { path: '/frens', Component: FrensPage },
  { path: '/game', Component: GamePage },
];
