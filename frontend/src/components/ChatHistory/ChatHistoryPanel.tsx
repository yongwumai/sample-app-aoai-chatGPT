import { CommandBarButton, ContextualMenu, DefaultButton, Dialog, DialogFooter, DialogType, ICommandBarStyles, IContextualMenuItem, IStackStyles, PrimaryButton, Spinner, SpinnerSize, Stack, StackItem, Text } from "@fluentui/react";
import { useBoolean } from '@fluentui/react-hooks';

import styles from "./ChatHistoryPanel.module.css"
import { useContext } from "react";
import { AppStateContext } from "../../state/AppProvider";
import React from "react";
import ChatHistoryList from "./ChatHistoryList";
import { ChatHistoryLoadingState, historyDeleteAll } from "../../api";

interface ChatHistoryPanelProps {

}

export enum ChatHistoryPanelTabs {
    History = "历史"
}

const commandBarStyle: ICommandBarStyles = {
    root: {
        padding: '0',
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: 'transparent'
    },
};

const commandBarButtonStyle: Partial<IStackStyles> = { root: { height: '50px' } };

export function ChatHistoryPanel(props: ChatHistoryPanelProps) {
    const appStateContext = useContext(AppStateContext)
    const [showContextualMenu, setShowContextualMenu] = React.useState(false);
    const [hideClearAllDialog, { toggle: toggleClearAllDialog }] = useBoolean(true);
    const [clearing, setClearing] = React.useState(false)
    const [clearingError, setClearingError] = React.useState(false)

    const clearAllDialogContentProps = {
        type: DialogType.close,
        title: !clearingError? '确定删除所有聊天记录吗?' : '删除所有聊天记录时出错',
        closeButtonAriaLabel: 'Close',
        subText: !clearingError ? '所有聊天记录被永久删除。' : '请再试一次。 如果问题仍然存在，请联系站点管理员。',
    };
    
    const modalProps = {
        titleAriaId: 'labelId',
        subtitleAriaId: 'subTextId',
        isBlocking: true,
        styles: { main: { maxWidth: 450 } },
    }

    const menuItems: IContextualMenuItem[] = [
        { key: 'clearAll', text: '删除全部', iconProps: { iconName: 'Delete' }},
    ];

    const handleHistoryClick = () => {
        appStateContext?.dispatch({ type: 'TOGGLE_CHAT_HISTORY' })
    };
    
    const onShowContextualMenu = React.useCallback((ev: React.MouseEvent<HTMLElement>) => {
        ev.preventDefault(); // don't navigate
        setShowContextualMenu(true);
    }, []);

    const onHideContextualMenu = React.useCallback(() => setShowContextualMenu(false), []);

    const onClearAllChatHistory = async () => {
        setClearing(true)
        let response = await historyDeleteAll()
        if(!response.ok){
            setClearingError(true)
        }else{
            appStateContext?.dispatch({ type: 'DELETE_CHAT_HISTORY' })
            toggleClearAllDialog();
        }
        setClearing(false);
    }

    const onHideClearAllDialog = () => {
        toggleClearAllDialog()
        setTimeout(() => {
            setClearingError(false)
        }, 2000);
    }

    React.useEffect(() => {}, [appStateContext?.state.chatHistory, clearingError]);

    return (
        <section className={styles.container} data-is-scrollable aria-label={"chat history panel"}>
            <Stack horizontal horizontalAlign='space-between' verticalAlign='center' wrap aria-label="chat history header">
                <StackItem>
                    <Text role="heading" aria-level={2} style={{ alignSelf: "center", fontWeight: "600", fontSize: "18px", marginRight: "auto", paddingLeft: "20px" }}>历史对话</Text>
                </StackItem>
                <Stack verticalAlign="start">
                    <Stack horizontal styles={commandBarButtonStyle}>
                        <CommandBarButton
                            iconProps={{ iconName: 'More' }}
                            title={"清除所有聊天记录"}
                            onClick={onShowContextualMenu}
                            aria-label={"清除所有聊天记录"}
                            styles={commandBarStyle}
                            role="button"
                            id="moreButton"
                        />
                        <ContextualMenu
                            items={menuItems}
                            hidden={!showContextualMenu}
                            target={"#moreButton"}
                            onItemClick={toggleClearAllDialog}
                            onDismiss={onHideContextualMenu}
                        />
                        <CommandBarButton
                            iconProps={{ iconName: 'Cancel' }}
                            title={"Hide"}
                            onClick={handleHistoryClick}
                            aria-label={"hide button"}
                            styles={commandBarStyle}
                            role="button"
                        />
                    </Stack>
                </Stack>
            </Stack>
            <Stack aria-label="chat history panel content"
                styles={{
                    root: {
                        display: "flex",
                        flexGrow: 1,
                        flexDirection: "column",
                        paddingTop: '2.5px',
                        maxWidth: "100%"
                    },
                }}
                style={{
                    display: "flex",
                    flexGrow: 1,
                    flexDirection: "column",
                    flexWrap: "wrap",
                    padding: "1px"
                }}>
                <Stack className={styles.chatHistoryListContainer}>
                    {(appStateContext?.state.chatHistoryLoadingState === ChatHistoryLoadingState.Success && appStateContext?.state.isCosmosDBAvailable.cosmosDB) && <ChatHistoryList/>}
                    {(appStateContext?.state.chatHistoryLoadingState === ChatHistoryLoadingState.Fail && appStateContext?.state.isCosmosDBAvailable) && <>
                        <Stack>
                            <Stack horizontalAlign='center' verticalAlign='center' style={{ width: "100%", marginTop: 10 }}>
                                <StackItem>
                                    <Text style={{ alignSelf: 'center', fontWeight: '400', fontSize: 16 }}>
                                        {appStateContext?.state.isCosmosDBAvailable?.status && <span>{appStateContext?.state.isCosmosDBAvailable?.status}</span>}
                                        {!appStateContext?.state.isCosmosDBAvailable?.status && <span>历史记录</span>}
                                        
                                    </Text>
                                </StackItem>
                                <StackItem>
                                    <Text style={{ alignSelf: 'center', fontWeight: '400', fontSize: 14 }}>
                                        <span>保存失败</span>
                                    </Text>
                                </StackItem>
                            </Stack>
                        </Stack>
                    </>}
                    {appStateContext?.state.chatHistoryLoadingState === ChatHistoryLoadingState.Loading && <>
                        <Stack>
                            <Stack horizontal horizontalAlign='center' verticalAlign='center' style={{ width: "100%", marginTop: 10 }}>
                                <StackItem style={{ justifyContent: 'center', alignItems: 'center' }}>
                                    <Spinner style={{ alignSelf: "flex-start", height: "100%", marginRight: "5px" }} size={SpinnerSize.medium} />
                                </StackItem>
                                <StackItem>
                                    <Text style={{ alignSelf: 'center', fontWeight: '400', fontSize: 14 }}>
                                        <span style={{ whiteSpace: 'pre-wrap' }}>加载历史记录</span>
                                    </Text>
                                </StackItem>
                            </Stack>
                        </Stack>
                    </>}
                </Stack>
            </Stack>
            <Dialog
                hidden={hideClearAllDialog}
                onDismiss={clearing ? ()=>{} : onHideClearAllDialog}
                dialogContentProps={clearAllDialogContentProps}
                modalProps={modalProps}
            >
                <DialogFooter>
                {!clearingError && <PrimaryButton onClick={onClearAllChatHistory} disabled={clearing} text="Clear All" />}
                <DefaultButton onClick={onHideClearAllDialog} disabled={clearing} text={!clearingError ? "Cancel" : "Close"} />
                </DialogFooter>
            </Dialog>
        </section>
    );
}