import type { ManifestRegistry } from "@atrilabs/core";
import { manifestRegistryController } from "@atrilabs/core";
// default import all manifest files here
import ButtonManifests from "@atrilabs/react-component-manifests/src/manifests/Button/Button";
import AccordianManifests from "@atrilabs/react-component-manifests/src/manifests/Accordion/Accordion";
import CarouselManifests from "@atrilabs/react-component-manifests/src/manifests/Carousel/Carousel";
import CountdownManifests from "@atrilabs/react-component-manifests/src/manifests/Countdown/Countdown";
import CountupManifests from "@atrilabs/react-component-manifests/src/manifests/CountUp/CountUp";
import FlexManifests from "@atrilabs/react-component-manifests/src/manifests/Flex/Flex";
import ImageManifests from "@atrilabs/react-component-manifests/src/manifests/Image/Image";
import InputManifests from "@atrilabs/react-component-manifests/src/manifests/Input/Input";
import TextboxManifests from "@atrilabs/react-component-manifests/src/manifests/TextBox/TextBox";
import RadioManifests from "@atrilabs/react-component-manifests/src/manifests/Radio/Radio";
import RatingManifests from "@atrilabs/react-component-manifests/src/manifests/Rating/Rating";
import BreadcrumbManifests from "@atrilabs/react-component-manifests/src/manifests/Breadcrumb/Breadcrumb";
import SliderManifests from "@atrilabs/react-component-manifests/src/manifests/Slider/Slider";
import StepManifests from "@atrilabs/react-component-manifests/src/manifests/Step/Step";
import ToggleManifests from "@atrilabs/react-component-manifests/src/manifests/Toggle/Toggle";
import UploadManifests from "@atrilabs/react-component-manifests/src/manifests/Upload/Upload";
import LinkManifests from "@atrilabs/react-component-manifests/src/manifests/Link/Link";
import MenuManifests from "@atrilabs/react-component-manifests/src/manifests/Menu/Menu";
import VerticalMenuManifests from "@atrilabs/react-component-manifests/src/manifests/VerticalMenu/VerticalMenu";
import LineChartManifests from "@atrilabs/react-component-manifests/src/manifests/charts/LineChart/LineChart";
import BarChartManifests from "@atrilabs/react-component-manifests/src/manifests/charts/BarChart/BarChart";
import AreaChartManifests from "@atrilabs/react-component-manifests/src/manifests/charts/AreaChart/AreaChart";
import ScatterChartManifests from "@atrilabs/react-component-manifests/src/manifests/charts/ScatterChart/ScatterChart";
import PieChartManifests from "@atrilabs/react-component-manifests/src/manifests/charts/PieChart/PieChart";
import HistogramChartManifests from "@atrilabs/react-component-manifests/src/manifests/charts/HistogramChart/HistogramChart";
import CandleStickManifests from "@atrilabs/react-component-manifests/src/manifests/charts/CandleStick/CandleStick";
import RadialbarChartManifests from "@atrilabs/react-component-manifests/src/manifests/charts/RadialbarChart/RadiadbarChart";
import GranttChartManifest from "@atrilabs/react-component-manifests/src/manifests/charts/GanttChart/GanttChart";
import TreemapChartManifest from "@atrilabs/react-component-manifests/src/manifests/charts/TreemapChart/TreemapChart";
import CheckboxManifests from "@atrilabs/react-component-manifests/src/manifests/Checkbox/Checkbox";
import DropdownManifests from "@atrilabs/react-component-manifests/src/manifests/Dropdown/Dropdown";
import TableManifests from "@atrilabs/react-component-manifests/src/manifests/Table/Table";
import DivManifests from "@atrilabs/react-component-manifests/src/manifests/Div/Div";
import AlertManifests from "@atrilabs/react-component-manifests/src/manifests/Alert/Alert";
import UnorderedListManifests from "@atrilabs/react-component-manifests/src/manifests/UnorderedList/UnorderedList";
import IconManifests from "@atrilabs/react-component-manifests/src/manifests/Icon/Icon";
import ModalManifests from "@atrilabs/react-component-manifests/src/manifests/Modal/Modal";
import FormManifests from "@atrilabs/react-component-manifests/src/manifests/Form/Form";
import OverlayManifests from "@atrilabs/react-component-manifests/src/manifests/Overlay/Overlay";
import CascaderManifests from "@atrilabs/react-component-manifests/src/manifests/Cascader/Cascader";
import TestimonialManifests from "@atrilabs/react-component-manifests/src/manifests/Testimonial/Testimonial";

const reactComponentManifestPkg = "@atrilabs/react-component-manifests";

function defaultImportsToRegistry(defaultImports: any[]) {
  const manifests: { [manifestId: string]: { components: any[] } } = {};
  for (let i = 0; i < defaultImports.length; i++) {
    const defaultImport = defaultImports[i]!;
    if (defaultImport && defaultImport["manifests"]) {
      const currManifests = defaultImport["manifests"];
      const manifestIds = Object.keys(currManifests);
      manifestIds.forEach((manifestId) => {
        if (
          currManifests[manifestId] &&
          !Array.isArray(currManifests[manifestId])
        ) {
          return;
        }
        if (manifests[manifestId]) {
          manifests[manifestId]!.components.push(...currManifests[manifestId]);
        } else {
          manifests[manifestId] = { components: currManifests[manifestId] };
        }
      });
    }
  }
  return manifests;
}

function registerComponents(
  registry: {
    [manifestId: string]: {
      components: ManifestRegistry["0"]["components"]["0"]["component"][];
    };
  },
  pkg: string
) {
  const manifestIds = Object.keys(registry);
  manifestIds.forEach((manifestId) => {
    const components = registry[manifestId]!.components.map((component) => {
      return { component, pkg };
    });
    manifestRegistryController.writeComponents(manifestId, components);
    console.log(manifestRegistryController.readManifestRegistry());
  });
}

// add default import to this array
const defaultImports = [
  ButtonManifests,
  AccordianManifests,
  CarouselManifests,
  BreadcrumbManifests,
  CountdownManifests,
  CountupManifests,
  FlexManifests,
  ImageManifests,
  InputManifests,
  TextboxManifests,
  RadioManifests,
  RatingManifests,
  SliderManifests,
  StepManifests,
  ToggleManifests,
  UploadManifests,
  LinkManifests,
  MenuManifests,
  VerticalMenuManifests,
  LineChartManifests,
  BarChartManifests,
  AreaChartManifests,
  ScatterChartManifests,
  PieChartManifests,
  HistogramChartManifests,
  CandleStickManifests,
  RadialbarChartManifests,
  GranttChartManifest,
  TreemapChartManifest,
  CheckboxManifests,
  DropdownManifests,
  TableManifests,
  DivManifests,
  AlertManifests,
  TestimonialManifests,
  IconManifests,
  ModalManifests,
  FormManifests,
  OverlayManifests,
  UnorderedListManifests,
  CascaderManifests,
];

const registry = defaultImportsToRegistry(defaultImports);

registerComponents(registry, reactComponentManifestPkg);
