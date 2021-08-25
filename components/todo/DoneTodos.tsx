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
      <div className='absolute flex flex-wrap -top-5 justify-evenly'>
        {todos?.map((todo) => (
          <CustomTooltip text={todo.todo} key={todo.id} showArrow={false}>
            <div
              className={clsx(
                'w-full max-w-sm px-3 pr-10 py-1 border border-gray-400 relative rounded',
                todo?.priority === 1 && 'bg-red-200',
                todo?.priority === 2 && 'bg-yellow-100',
                todo?.priority === 3 && 'bg-green-100'
              )}
              style={{
                transform: 'rotate(70deg)',
                left: Math.floor(Math.random() * 100) + 'px',
              }}>
              {truncate(todo.todo, {
                length: 30,
              })}
            </div>
          </CustomTooltip>
        ))}
      </div>
    </div>
  );
};

export default DoneTodos;
