import { useAuth } from '@/auth/hooks/useAuth';
import { AdvancedSettingsWrapper } from '@/settings/components/AdvancedSettingsWrapper';
import { SettingsNavigationDrawerItem } from '@/settings/components/SettingsNavigationDrawerItem';
import {
  SettingsNavigationItem,
  SettingsNavigationSection,
  useSettingsNavigationItems,
} from '@/settings/hooks/useSettingsNavigationItems';
import { NavigationDrawerItem } from '@/ui/navigation/navigation-drawer/components/NavigationDrawerItem';
import { NavigationDrawerItemGroup } from '@/ui/navigation/navigation-drawer/components/NavigationDrawerItemGroup';
import { NavigationDrawerSection } from '@/ui/navigation/navigation-drawer/components/NavigationDrawerSection';
import { NavigationDrawerSectionTitle } from '@/ui/navigation/navigation-drawer/components/NavigationDrawerSectionTitle';
import { getNavigationSubItemLeftAdornment } from '@/ui/navigation/navigation-drawer/utils/getNavigationSubItemLeftAdornment';
import { ScrollWrapper } from '@/ui/utilities/scroll/components/ScrollWrapper';
import styled from '@emotion/styled';
import { useLingui } from '@lingui/react/macro';
import { matchPath, resolvePath, useLocation } from 'react-router-dom';
import { IconDoorEnter } from 'twenty-ui';
import { getSettingsPath } from '~/utils/navigation/getSettingsPath';

const StyledInnerContainer = styled.div`
  height: 100%;
`;

export const SettingsNavigationDrawerItems = () => {
  const { signOut } = useAuth();
  const { t } = useLingui();

  const settingsNavigationItems: SettingsNavigationSection[] =
    useSettingsNavigationItems();

  const currentPathName = useLocation().pathname;

  const getSelectedIndexForSubItems = (subItems: SettingsNavigationItem[]) => {
    return subItems.findIndex((subItem) => {
      const href = subItem.path ? getSettingsPath(subItem.path) : '';
      const pathName = resolvePath(href).pathname;

      return matchPath(
        {
          path: pathName,
          end: subItem.matchSubPages === false,
        },
        currentPathName,
      );
    });
  };

  return (
    <ScrollWrapper
      contextProviderName="navigationDrawer"
      componentInstanceId={`scroll-wrapper-settings-navigation-drawer`}
      scrollbarVariant="no-padding"
      heightMode="fit-content"
      defaultEnableXScroll={false}
    >
      <StyledInnerContainer>
        {settingsNavigationItems.map((section) => {
          const allItemsHidden = section.items.every((item) => item.isHidden);
          if (allItemsHidden) {
            return null;
          }

          return (
            <NavigationDrawerSection key={section.label}>
              {section.isAdvanced ? (
                <AdvancedSettingsWrapper hideDot>
                  <NavigationDrawerSectionTitle label={section.label} />
                </AdvancedSettingsWrapper>
              ) : (
                <NavigationDrawerSectionTitle label={section.label} />
              )}
              {section.items.map((item, index) => {
                const subItems = item.subItems;
                if (Array.isArray(subItems) && subItems.length > 0) {
                  const selectedSubItemIndex =
                    getSelectedIndexForSubItems(subItems);

                  return (
                    <NavigationDrawerItemGroup
                      key={item.path || `group-${index}`}
                    >
                      <SettingsNavigationDrawerItem
                        item={item}
                        subItemState={
                          item.indentationLevel
                            ? getNavigationSubItemLeftAdornment({
                                arrayLength: section.items.length,
                                index,
                                selectedIndex: selectedSubItemIndex,
                              })
                            : undefined
                        }
                      />
                      {subItems.map((subItem, subIndex) => (
                        <SettingsNavigationDrawerItem
                          key={subItem.path || `subitem-${subIndex}`}
                          item={subItem}
                          subItemState={
                            subItem.indentationLevel
                              ? getNavigationSubItemLeftAdornment({
                                  arrayLength: subItems.length,
                                  index: subIndex,
                                  selectedIndex: selectedSubItemIndex,
                                })
                              : undefined
                          }
                        />
                      ))}
                    </NavigationDrawerItemGroup>
                  );
                }
                return (
                  <SettingsNavigationDrawerItem
                    key={item.path || `item-${index}`}
                    item={item}
                    subItemState={
                      item.indentationLevel
                        ? getNavigationSubItemLeftAdornment({
                            arrayLength: section.items.length,
                            index,
                            selectedIndex: index,
                          })
                        : undefined
                    }
                  />
                );
              })}
            </NavigationDrawerSection>
          );
        })}
        <NavigationDrawerSection>
          <NavigationDrawerItem
            label={t`Logout`}
            onClick={signOut}
            Icon={IconDoorEnter}
          />
        </NavigationDrawerSection>
      </StyledInnerContainer>
    </ScrollWrapper>
  );
};
