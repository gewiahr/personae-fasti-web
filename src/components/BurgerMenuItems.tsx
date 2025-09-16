import { useState } from "react"
import Icon from "./icons/Icon"
import { Link } from "react-router-dom"

export type BurgerMenuItem = {
  name: string;
};

export interface BurgerMenuItemLink extends BurgerMenuItem {
  internal: boolean;
  path: string;
}

export interface BurgerMenuItemCategory extends BurgerMenuItem {
  foldable: boolean;
  children: (BurgerMenuItem | BurgerMenuItemLink | BurgerMenuItemCategory)[];

  open: boolean;
};

export interface BurgerMenuItemCallable extends BurgerMenuItem {
  callable: () => void;
};

interface BurgerMenuItemProps {
  item : BurgerMenuItem;
};

export const BurgerMenuItem = ({ item } : BurgerMenuItemProps) => {
  return (
    <>
      <div className="block w-full px-4 max-sm:py-4 sm:py-2 text-white text-left rounded-md">
        <div className='flex items-center justify-between'>
          <p className='text-left'>{item.name}</p>
        </div>
      </div>
    </>
  )
};

interface BurgerMenuItemLinkProps {
  item: BurgerMenuItemLink;
};

export const BurgerMenuItemLinkExternal = ({ item } : BurgerMenuItemLinkProps) => {
  const ExternalLinkOnClick = (path: string) => {
    return window.location.href = `${path}`;
  };

  return (
    <>
      <button
        onClick={() => ExternalLinkOnClick(item.path)}
        className="block cursor-pointer w-full px-4 max-sm:py-4 sm:py-2 text-white text-left hover:bg-gray-700 rounded-md"
      >
        <div className='flex items-center justify-between'>
          <p className='text-left'>{item.name}</p>
        </div>
      </button>
    </>
  )
};

interface BurgerMenuItemLinkInternalProps extends BurgerMenuItemLinkProps {
  setClose: () => void;
};

export const BurgerMenuItemLinkInternal = ({ item, setClose } : BurgerMenuItemLinkInternalProps) => {
  return (
    <>
      <Link
        key={item.path}
        to={item.path}
        className="block px-4 max-sm:py-4 sm:py-2 text-white hover:bg-gray-700 rounded-md"
        onClick={setClose}
      >
        <div className='flex items-center justify-between'>
          <p className='text-left'>{item.name}</p>
        </div>
      </Link>
    </>
  )
};

interface BurgerMenuItemCategoryProps {
  item: BurgerMenuItemCategory;
};

export const BurgerMenuItemCategory = ({ item } : BurgerMenuItemCategoryProps) => {
  return (
    <>
      <div className="block w-full px-4 max-sm:py-4 sm:py-2 text-white text-left rounded-md">
        <div className='flex items-center justify-between'>
          <p className='text-left'>{item.name}</p>
        </div>
      </div>
    </>
  )
}

interface BurgerMenuItemCategoryFoldableProps extends BurgerMenuItemCategoryProps {
  itemOnChange: (item: BurgerMenuItemCategory) => void;
  setClose: () => void;
};

export const BurgerMenuItemCategoryFoldable = ({ item, itemOnChange, setClose } : BurgerMenuItemCategoryFoldableProps) => {
  const [foldableItem, setFoldableItem] = useState<BurgerMenuItemCategory>(item);

  const openFoldable = () => {
    var changedItem : BurgerMenuItemCategory = {...item, open: !item.open}
    itemOnChange(changedItem)
    setFoldableItem(changedItem);
  };

  return (
    <>
      <button
        onClick={openFoldable}
        className="block cursor-pointer w-full px-4 max-sm:py-4 sm:py-2 text-white text-left hover:bg-gray-700 rounded-md"
      >
        <div className='flex items-center justify-between'>
          <p className='text-left'>{foldableItem.name}</p>
          <Icon name={`${foldableItem.open ? 'arrowUp' : 'arrowDown'}`} />
        </div>
      </button>
      {foldableItem.open ? foldableItem.children.map((ci) =>
        'internal' in ci ?
          ci.internal ?
          <BurgerMenuItemLinkInternal item={ci} setClose={setClose} /> :
          <BurgerMenuItemLinkExternal item={ci} /> : 
        <BurgerMenuItem item={ci} />
      ) : null}  
    </>
  )
};

interface BurgerMenuItemCallableProps {
  item: BurgerMenuItemCallable;
};

export const BurgerMenuItemCallable = ({ item } : BurgerMenuItemCallableProps) => {
  return (
    <>
      <button
        onClick={item.callable}
        className="block cursor-pointer w-full px-4 max-sm:py-4 sm:py-2 text-white text-left hover:bg-gray-700 rounded-md"
      >
        <div className='flex items-center justify-between'>
          <p className='text-left'>{item.name}</p>
        </div>
      </button>
    </>
  )
};
