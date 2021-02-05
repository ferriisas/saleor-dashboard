import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { makeStyles } from "@material-ui/core/styles";
import { ProductMediaFragment } from "@saleor/fragments/types/ProductMediaFragment";
import { buttonMessages } from "@saleor/intl";
import ProductMediaVideo from "@saleor/products/components/ProductMediaVideo/ProductMediaVideo";
import { ProductMediaType } from "@saleor/types/globalTypes";
import classNames from "classnames";
import React from "react";
import { FormattedMessage } from "react-intl";

const useStyles = makeStyles(
  theme => ({
    image: {
      height: "100%",
      objectFit: "contain",
      userSelect: "none",
      width: "100%"
    },
    imageContainer: {
      background: "#ffffff",
      border: "1px solid #eaeaea",
      borderRadius: theme.spacing(),
      cursor: "pointer",
      height: theme.spacing(21.5),
      overflow: "hidden",
      padding: theme.spacing(2),
      position: "relative",
      transitionDuration: theme.transitions.duration.standard + "ms"
    },
    root: {
      display: "grid",
      gridColumnGap: theme.spacing(2),
      gridRowGap: theme.spacing(2),
      gridTemplateColumns: "repeat(3, 1fr)",
      maxWidth: "100%",
      width: theme.breakpoints.values.lg,
      [theme.breakpoints.down("sm")]: {
        gridTemplateColumns: "repeat(2, 1fr)"
      }
    },
    selectedImageContainer: {
      borderColor: theme.palette.primary.main
    }
  }),
  { name: "ProductVariantImageSelectDialog" }
);

interface ProductVariantImageSelectDialogProps {
  media?: ProductMediaFragment[];
  selectedMedia?: string[];
  open: boolean;
  onClose();
  onMediaSelect(id: string);
}

const ProductVariantMediaSelectDialog: React.FC<ProductVariantImageSelectDialogProps> = props => {
  const { media, open, selectedMedia, onClose, onMediaSelect } = props;
  const classes = useStyles(props);

  return (
    <Dialog onClose={onClose} open={open}>
      <DialogTitle>
        <FormattedMessage
          defaultMessage="Media Selection"
          description="dialog header"
        />
      </DialogTitle>
      <DialogContent>
        <div className={classes.root}>
          {media
            .sort((prev, next) => (prev.sortOrder > next.sortOrder ? 1 : -1))
            .map(mediaObj => (
              <div
                className={classNames([
                  classes.imageContainer,
                  {
                    [classes.selectedImageContainer]:
                      selectedMedia.indexOf(mediaObj.id) !== -1
                  }
                ])}
                onClick={onMediaSelect(mediaObj.id)}
                key={mediaObj.id}
              >
                {mediaObj?.type !== ProductMediaType.IMAGE ? (
                  <ProductMediaVideo
                    className={classes.image}
                    video={mediaObj}
                    withOverlay
                  />
                ) : (
                  <img
                    className={classes.image}
                    src={mediaObj.url}
                    alt={mediaObj.alt}
                  />
                )}
              </div>
            ))}
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>
          <FormattedMessage {...buttonMessages.back} />
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ProductVariantMediaSelectDialog.displayName = "ProductVariantMediaSelectDialog";
export default ProductVariantMediaSelectDialog;