import { useState } from 'react';
import './styles/global.css';

import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const createUserFormSchema = z.object({
  avatar: z.instanceof(FileList)
    .transform(list => list.item(0))
    .refine(file => file!.size <= 5 * 1024 * 1024, 'O arquivo precisa ter no maximo 5MB'),
  name: z.string()
    .nonempty('O nome é obrigatório')
    .transform(name => {
      return name.trim().split(' ').map(word => {
        return word[0].toLocaleUpperCase().concat(word.substring(1));
      }).join(' ')
    }),
  email: z.string()
    .nonempty('o E-mail é obrigatório')
    .email('Formato de E-mail Inválido')
    .toLowerCase(),
  password: z.string()
    .min(6, 'A senha precisa de no minimo 6 caracteres'),
  techs: z.array(z.object({
    title: z.string().nonempty('o Titulo é obrigatório'),
    knowledge: z.coerce.number().min(1, 'O valor precisar ser maior que 0').max(100)
  })).min(2, 'Insira ao menos 2 tecnologias')
});

type CreateUserFormData = z.infer<typeof createUserFormSchema>

function App() {
  const [output, setOutput] = useState('');
  const { register, handleSubmit, control, formState: { errors } } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserFormSchema)
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'techs',
  });

  function createUser(data: CreateUserFormData){
    console.log(data.avatar);
    setOutput(JSON.stringify(data, null, 2));
  }

  function addNewTech(){
    append({ title: '', knowledge: 0 }) 
  }

  return (
    <main className='h-screen bg-zinc-950 flex items-center justify-center flex-col text-zinc-300'>
      <form className='flex flex-col gap-4 w-full max-w-xs text-zinc-100'
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onSubmit={handleSubmit(createUser)}
      >
        <div className='flex flex-col gap-1'>
          <label htmlFor="">Avatar</label>
          <input 
            type="file"
            accept='image/*' 
            {...register('avatar')}
          />
          { errors.avatar && <span className='text-red-500 text-sm'>{errors.avatar.message}</span> }
        </div>
        
        <div className='flex flex-col gap-1'>
          <label htmlFor="">Nome</label>
          <input className='border-zinc-200 shadow-sm rounded h-10 px-3 bg-zinc-900 text-white' 
            type="text" 
            {...register('name')}
          />
          { errors.name && <span className='text-red-500 text-sm'>{errors.name.message}</span> }
        </div>

        <div className='flex flex-col gap-1'>
          <label htmlFor="">E-mail</label>
          <input className='border-zinc-200 shadow-sm rounded h-10 px-3 bg-zinc-900 text-white' 
            type="email" 
            {...register('email')}
          />
          { errors.email && <span className='text-red-500 text-sm'>{errors.email.message}</span> }
        </div>

        <div className='flex flex-col gap-1'>
          <label htmlFor="">Senha</label>
          <input className='border-zinc-200 shadow-sm rounded h-10 px-3 bg-zinc-900 text-white' 
            type="password" 
            {...register('password')}
          />
          { errors.password && <span className='text-red-500 text-sm'>{errors.password.message}</span> }
        </div>

            <div className='flex flex-col gap-1'>
              <label htmlFor="" className='flex items-center justify-between'>Tecnologias
                <button type='button' onClick={addNewTech} className='text-emerald-500 text-sm'>
                  Adicionar
                </button>
              </label>
                { fields.map((field, index) => {
                  return(
                    <div className='flex gap-2' key={field.id}>
                      <div className='flex flex-1 flex-col gap-1'>  
                        <input className=' border-zinc-200 shadow-sm rounded h-10 px-3 bg-zinc-900 text-white' 
                          type="text" 
                          {...register(`techs.${index}.title`)}
                        />

                        { errors.techs?.[index]?.title && <span className='text-red-500 text-sm'>{errors.techs?.[index]?.title?.message}</span> }
                      </div>

                      <div className='flex flex-1 flex-col gap-1'>
                        <input className='w-16 border-zinc-200 shadow-sm rounded h-10 px-3 bg-zinc-900 text-white' 
                          type="number" 
                          {...register(`techs.${index}.knowledge`)}
                        />

                        { errors.techs?.[index]?.knowledge && <span className='text-red-500 text-sm'>{errors.techs?.[index]?.knowledge?.message}</span> }
                      </div>
                      
                    </div>
                  )
                })} 

                { errors.techs && <span className='text-red-500 text-sm'>{errors.techs.message}</span> }

            </div>

        <button type='submit' className='bg-emerald-500 rounded font-semibold text-white h-10 hover:bg-emerald-600'>Salvar</button>
      </form>

      <pre>
        {output}
      </pre>
    </main>
  )
}

export default App
