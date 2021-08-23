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

const Page: React.FC<{ user: UserProfile }> = ({ user }) => {
  const router = useRouter();

  const { data: todolist, mutate } = useSWR<
    todolists & {
      todos: todos[];
    }
  >(`/api/todo/get-todolist/?todolistId=${router.query.todolistId}`, fetcher);

  return (
    <div>
      <Head>
        <title>{user.name || user.nickname}&apos;s Todolists</title>
      </Head>
      <DashboardLayout>
        <h1 className='mb-2 text-4xl font-extrabold'>
          {todolist?.todolistName}
        </h1>
        <div className='my-10'>
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
      </DashboardLayout>
    </div>
  );
};

export default withPageAuthRequired(Page);
