/* eslint-disable react-hooks/rules-of-hooks */
import fetcher from '@/lib/fetcher';
import { UserProfile, withPageAuthRequired } from '@auth0/nextjs-auth0';
import DashboardLayout from 'layouts/DashboardLayout';
import Link from 'next/link';
import useSWR from 'swr';
import Head from 'next/head';
import { todolists, todos } from '@prisma/client';
import { useRouter } from 'next/router';
import Todo from '@/components/todo/Todo';
import NewTodo from '@/components/todo/NewTodo';
import DoneTodos from '@/components/todo/DoneTodos';
import clsx from 'clsx';

const Page: React.FC<{ user: UserProfile }> = ({ user }) => {
  const router = useRouter();

  const { data: todolist, mutate } = useSWR<
    todolists & {
      todos: todos[];
    }
  >(`/api/todo/get-todolist/?todolistId=${router.query.todolistId}`, fetcher);

  const pointsTable = {
    1: 5,
    2: 3,
    3: 1,
  };
  let points = 0;
  todolist?.todos?.forEach((todo) => {
    if (todo?.isDone) {
      points += pointsTable[todo.priority];
    }
  });

  return (
    <div>
      <Head>
        <title>{user.name || user.nickname}&apos;s Todolists</title>
      </Head>
      <DashboardLayout>
        <Link href='/app/todo'>
          <a className='block mb-3 text-gray-500 font-base'>{'<-'} Go Back</a>
        </Link>
        <h1 className='mb-2 text-4xl font-extrabold'>
          {todolist?.todolistName}
        </h1>
        <div className='flex flex-col md:flex-row'>
          <div className='flex-1 my-10'>
            {todolist?.todos?.map(
              (todo) =>
                todo?.isDone === false && (
                  <Todo
                    mutate={mutate}
                    todo={todo}
                    key={todo?.id}
                    restOfData={todolist}
                  />
                )
            )}
            <NewTodo
              todolistId={todolist?.id}
              mutate={mutate}
              restOfData={todolist}
              listName={todolist?.todolistName}
            />
          </div>
          <div className='flex-1'>
            <div className='relative hidden my-10 md:block'>
              <DoneTodos todos={todolist?.todos} />
            </div>
            <div className='relative block my-10 md:hidden'>
              <h2 className='block my-10 text-3xl font-extrabold md:hidden'>
                Completed tasks
              </h2>
              {todolist?.todos?.map((todo) => (
                <div
                  key={todo.id}
                  className={clsx(
                    'w-full max-w-sm my-2 px-3 pr-10 py-1 border border-gray-200 relative rounded',
                    todo?.priority === 1 && 'bg-red-200',
                    todo?.priority === 2 && 'bg-yellow-100',
                    todo?.priority === 3 && 'bg-green-100'
                  )}>
                  {todo.todo}
                </div>
              ))}
            </div>
            <h2 className='z-30 text-lg font-extrabold md:text-3xl md:mt-16'>
              Points earned: {points}
            </h2>
          </div>
        </div>
      </DashboardLayout>
    </div>
  );
};

export default withPageAuthRequired(Page);
