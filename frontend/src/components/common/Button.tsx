import { CommandBarButton, DefaultButton, IButtonProps, IButtonStyles, ICommandBarStyles } from "@fluentui/react";

interface ShareButtonProps extends IButtonProps {
    onClick: () => void;
  }

export const ShareButton: React.FC<ShareButtonProps> = ({onClick}) => {
    const shareButtonStyles: ICommandBarStyles & IButtonStyles = {
        root: {
          width: '90px',
          height: '32px',
          borderRadius: '2px',
          background: 'radial-gradient(109.81% 107.82% at 100.1% 90.19%, #1ABF7F 33.63%, #1ABF7F 70.31%, #1ABF7F 100%)',
        //   position: 'absolute',
        //   right: 20,
          padding: '5px 12px',
          marginRight: '18px'
        },
        icon: {
          color: '#FFFFFF',
        },
        rootHovered: {
          background: 'radial-gradient(109.81% 107.82% at 100.1% 90.19%, #1ABF6F 33.63%, #1ABF6F 70.31%, #1ABF6F 100%)',
        },
        label: {
          fontWeight: 600,
          fontSize: '14px',
          lineHeight: '20px',
          color: '#FFFFFF',
        },
      };

      return (
        <CommandBarButton
                styles={shareButtonStyles}
                iconProps={{ iconName: 'Share' }}
                onClick={onClick}
                text="分享"
        />
      )
}

interface HistoryButtonProps extends IButtonProps {
    onClick: () => void;
    text: string;
  }

export const HistoryButton: React.FC<HistoryButtonProps> = ({onClick, text}) => {
    const historyButtonStyles: ICommandBarStyles & IButtonStyles = {
        root: {
            width: '90px',
            border: `1px solid #D1D1D1`,
            borderRadius: '2px',
            padding: '2px 12px',
            marginRight: '18px'
          },
          rootHovered: {
            border: `1px solid #D1D1D1`,
          },
          rootPressed: {
            border: `1px solid #D1D1D1`,
          },
      };

      return (
        <DefaultButton
            text={text}
            iconProps={{ iconName: 'History' }}
            onClick={onClick}
            styles={historyButtonStyles}
        />
      )
}