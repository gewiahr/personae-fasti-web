import { useState } from 'react';
import { BurgerMenuItem, BurgerMenuItemCallable, BurgerMenuItemCategory, BurgerMenuItemCategoryFoldable, BurgerMenuItemLink, BurgerMenuItemLinkExternal, BurgerMenuItemLinkInternal } from './BurgerMenuItems';

interface BurgerMenuProps {
  items: (BurgerMenuItem | BurgerMenuItemLink | BurgerMenuItemCategory | BurgerMenuItemCallable)[]
  setClose: () => void
}

export const BurgerMenu = ({ items, setClose }: BurgerMenuProps) => {
  const [menuItems, setMenuItems] = useState(items);

  const itemOnChange = (item: BurgerMenuItemCategory) => {
    var newMenuItems = menuItems.map((el) => el.name === item.name && 'open' in el ? { ...el, open: !el.open } : el);
    setMenuItems(newMenuItems);
  }

  return (
    <>   
      {menuItems.map((item) =>
      // Category 
      ('foldable' in item ?
        item.foldable ? 
          <BurgerMenuItemCategoryFoldable item={item} itemOnChange={itemOnChange} setClose={setClose}/> :
          <BurgerMenuItemCategory item={item} /> :
      // Link
      'internal' in item ?
        item.internal ?
          <BurgerMenuItemLinkInternal item={item} setClose={setClose} /> :
          <BurgerMenuItemLinkExternal item={item} /> : 
      // Callable
      'callable' in item ?
        <BurgerMenuItemCallable item={item} /> :
        null
      ))}
    </>
  );
};
