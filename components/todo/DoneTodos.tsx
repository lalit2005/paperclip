import { todos } from '@prisma/client';
import clsx from 'clsx';
import { FiTrash } from 'react-icons/fi';
import Bin from '@/public/todo-bin.png';
import Image from 'next/image';
import CustomTooltip from '../note/Tooltip';
import truncate from 'lodash.truncate';

const DoneTodos: React.FC<{ todos: todos[] }> = ({ todos }) => {
  todos = todos?.filter((todo) => todo.isDone);
  return (
    <div className='h-full'>
      <div className='relative top-10'>
        <Image
          src={Bin}
          className='absolute z-10 text-red-400 stroke-1 w-72 h-72'
          placeholder='blur'
          alt='Your completed todos'
        />
      </div>
      <div className='absolute -top-5 left-5'>
        {todos?.map((todo) => (
          <div
            key={todo.id}
            className={clsx(
              'w-full max-w-sm px-3 pr-10 py-1 border border-gray-200 relative rounded',
              todo?.priority === 1 && 'bg-red-200',
              todo?.priority === 2 && 'bg-yellow-100',
              todo?.priority === 3 && 'bg-green-100'
            )}
            style={{
              transform: 'rotate(70deg)',
              left: Math.floor(Math.random() * 300) + 'px',
            }}>
            <CustomTooltip text={todo.todo}>
              {truncate(todo.todo, {
                length: 30,
              })}
            </CustomTooltip>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoneTodos;
