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
          <BurgerMenuItemCategoryFoldable key={"" + item.name} item={item} itemOnChange={itemOnChange} setClose={setClose}/> :
          <BurgerMenuItemCategory key={"" + item.name} item={item} /> :
      // Link
      'internal' in item ?
        item.internal ?
          <BurgerMenuItemLinkInternal key={"" + item.name} item={item} setClose={setClose} /> :
          <BurgerMenuItemLinkExternal key={"" + item.name} item={item} /> : 
      // Callable
      'callable' in item ?
        <BurgerMenuItemCallable key={"" + item.name} item={item} /> :
        null
      ))}
    </>
  );
};
