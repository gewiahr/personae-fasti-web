const AttributionsContent = () => {
  return (
    <div className="flex flex-col gap-4">
      <p>В проекте использованы материалы из следующих источников: </p>
      <div className="flex flex-col text-left">
        <p>Шрифт AA Stetica</p>
        <a className='ref-text' href="https://www.fonts.uprock.ru/fonts/aa-stetica">https://www.fonts.uprock.ru/fonts/aa-stetica</a>
      </div>
      <div className="flex flex-col text-left">
        <p>Иконки Lucide и другие из библиотеки react-icons</p>
        <a className='ref-text' href="https://lucide.dev/icons/">https://lucide.dev/icons/</a>
        <a className='ref-text' href="https://react-icons.github.io/react-icons/">https://react-icons.github.io/react-icons/</a>
      </div>
      <p className="mt-4 italic">
        {`Все права сохранены. Если вы считаете что ваши материалы были использованы незаконно, 
        напишите мне на почту `}
        <a className='ref-text' href="mailto:gewiahr@gmail.com">gewiahr@gmail.com</a>
        {` или в телеграм `}
        <a className='ref-text' href="https://t.me/gewiahr">@gewiahr</a>
      </p>
    </div>
  )
};

export default AttributionsContent;
