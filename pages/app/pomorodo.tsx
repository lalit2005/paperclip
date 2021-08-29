import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import DashboardLayout from 'layouts/DashboardLayout';

const Page = () => {
  return <DashboardLayout></DashboardLayout>;
};

export default withPageAuthRequired(Page);
