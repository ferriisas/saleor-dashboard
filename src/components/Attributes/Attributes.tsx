import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import IconButton from "@material-ui/core/IconButton";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Typography from "@material-ui/core/Typography";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import CardTitle from "@saleor/components/CardTitle";
import Grid from "@saleor/components/Grid";
import Hr from "@saleor/components/Hr";
import MultiAutocompleteSelectField, {
  MultiAutocompleteChoiceType
} from "@saleor/components/MultiAutocompleteSelectField";
import SingleAutocompleteSelectField, {
  SingleAutocompleteChoiceType
} from "@saleor/components/SingleAutocompleteSelectField";
import { AttributeValueFragment } from "@saleor/fragments/types/AttributeValueFragment";
import { PageErrorWithAttributesFragment } from "@saleor/fragments/types/PageErrorWithAttributesFragment";
import { ProductErrorWithAttributesFragment } from "@saleor/fragments/types/ProductErrorWithAttributesFragment";
import { FormsetAtomicData, FormsetChange } from "@saleor/hooks/useFormset";
import { AttributeInputTypeEnum } from "@saleor/types/globalTypes";
import { getProductErrorMessage } from "@saleor/utils/errors";
import getPageErrorMessage from "@saleor/utils/errors/page";
import classNames from "classnames";
import React from "react";
import { FormattedMessage, IntlShape, useIntl } from "react-intl";

export interface AttributeInputData {
  inputType: AttributeInputTypeEnum;
  isRequired: boolean;
  values: AttributeValueFragment[];
}
export type AttributeInput = FormsetAtomicData<AttributeInputData, string[]>;
export interface AttributesProps {
  attributes: AttributeInput[];
  disabled: boolean;
  errors: Array<
    ProductErrorWithAttributesFragment | PageErrorWithAttributesFragment
  >;
  onChange: FormsetChange;
  onMultiChange: FormsetChange;
}

const useStyles = makeStyles(
  theme => ({
    attributeSection: {
      "&:last-of-type": {
        paddingBottom: 0
      },
      padding: theme.spacing(2, 0)
    },
    attributeSectionLabel: {
      alignItems: "center",
      display: "flex"
    },
    card: {
      overflow: "visible"
    },
    cardContent: {
      "&:last-child": {
        paddingBottom: theme.spacing(1)
      },
      paddingTop: theme.spacing(1)
    },
    expansionBar: {
      display: "flex"
    },
    expansionBarButton: {
      marginBottom: theme.spacing(1)
    },
    expansionBarButtonIcon: {
      transition: theme.transitions.duration.short + "ms"
    },
    expansionBarLabel: {
      color: theme.palette.text.disabled,
      fontSize: 14
    },
    expansionBarLabelContainer: {
      alignItems: "center",
      display: "flex",
      flex: 1
    },
    rotate: {
      transform: "rotate(180deg)"
    }
  }),
  { name: "Attributes" }
);

function getMultiChoices(
  values: AttributeValueFragment[]
): MultiAutocompleteChoiceType[] {
  return values.map(value => ({
    label: value.name,
    value: value.slug
  }));
}

function getMultiDisplayValue(
  attribute: AttributeInput
): MultiAutocompleteChoiceType[] {
  return attribute.value.map(attributeValue => {
    const definedAttributeValue = attribute.data.values.find(
      definedValue => definedValue.slug === attributeValue
    );
    if (!!definedAttributeValue) {
      return {
        label: definedAttributeValue.name,
        value: definedAttributeValue.slug
      };
    }

    return {
      label: attributeValue,
      value: attributeValue
    };
  });
}

function getSingleChoices(
  values: AttributeValueFragment[]
): SingleAutocompleteChoiceType[] {
  return values.map(value => ({
    label: value.name,
    value: value.slug
  }));
}

function getErrorMessage(
  err: ProductErrorWithAttributesFragment | PageErrorWithAttributesFragment,
  intl: IntlShape
): string {
  switch (err?.__typename) {
    case "ProductError":
      return getProductErrorMessage(err, intl);
    case "PageError":
      return getPageErrorMessage(err, intl);
  }
}

const Attributes: React.FC<AttributesProps> = ({
  attributes,
  disabled,
  errors,
  onChange,
  onMultiChange
}) => {
  const intl = useIntl();
  const classes = useStyles({});
  const [expanded, setExpansionStatus] = React.useState(true);
  const toggleExpansion = () => setExpansionStatus(!expanded);

  return (
    <Card className={classes.card}>
      <CardTitle
        title={intl.formatMessage({
          defaultMessage: "Attributes",
          description: "attributes, section header"
        })}
      />
      <CardContent className={classes.cardContent}>
        <div className={classes.expansionBar}>
          <div className={classes.expansionBarLabelContainer}>
            <Typography className={classes.expansionBarLabel} variant="caption">
              <FormattedMessage
                defaultMessage="{number} Attributes"
                description="number of attributes"
                values={{
                  number: attributes.length
                }}
              />
            </Typography>
          </div>
          <IconButton
            className={classes.expansionBarButton}
            onClick={toggleExpansion}
            data-test="attributes-expand"
          >
            <ArrowDropDownIcon
              className={classNames(classes.expansionBarButtonIcon, {
                [classes.rotate]: expanded
              })}
            />
          </IconButton>
        </div>
        {expanded && attributes.length > 0 && (
          <>
            <Hr />
            {attributes.map((attribute, attributeIndex) => {
              const error = errors.find(err =>
                err.attributes?.includes(attribute.id)
              );

              return (
                <React.Fragment key={attribute.id}>
                  {attributeIndex > 0 && <Hr />}
                  <Grid className={classes.attributeSection} variant="uniform">
                    <div
                      className={classes.attributeSectionLabel}
                      data-test="attribute-label"
                    >
                      <Typography>{attribute.label}</Typography>
                    </div>
                    <div data-test="attribute-value">
                      {attribute.data.inputType ===
                      AttributeInputTypeEnum.DROPDOWN ? (
                        <SingleAutocompleteSelectField
                          choices={getSingleChoices(attribute.data.values)}
                          disabled={disabled}
                          displayValue={
                            attribute.data.values.find(
                              value => value.slug === attribute.value[0]
                            )?.name ||
                            attribute.value[0] ||
                            ""
                          }
                          emptyOption={!attribute.data.isRequired}
                          error={!!error}
                          helperText={getErrorMessage(error, intl)}
                          name={`attribute:${attribute.label}`}
                          label={intl.formatMessage({
                            defaultMessage: "Value",
                            description: "attribute value"
                          })}
                          value={attribute.value[0]}
                          onChange={event =>
                            onChange(attribute.id, event.target.value)
                          }
                          allowCustomValues={!attribute.data.isRequired}
                        />
                      ) : (
                        <MultiAutocompleteSelectField
                          choices={getMultiChoices(attribute.data.values)}
                          displayValues={getMultiDisplayValue(attribute)}
                          disabled={disabled}
                          error={!!error}
                          helperText={getErrorMessage(error, intl)}
                          label={intl.formatMessage({
                            defaultMessage: "Values",
                            description: "attribute values"
                          })}
                          name={`attribute:${attribute.label}`}
                          value={attribute.value}
                          onChange={event =>
                            onMultiChange(attribute.id, event.target.value)
                          }
                          allowCustomValues={!attribute.data.isRequired}
                        />
                      )}
                    </div>
                  </Grid>
                </React.Fragment>
              );
            })}
          </>
        )}
      </CardContent>
    </Card>
  );
};
Attributes.displayName = "Attributes";
export default Attributes;