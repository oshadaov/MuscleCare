import RotatorImageManagement from "../components/RotatorImageManagement"

const RotatorImagesPage = () => {
  return (
    
      <div className="admin-page">
        <h1 className="admin-page-title">Image Rotator Management</h1>
        <p className="admin-page-description">
          Manage the images displayed in the image rotator on the homepage. You can add, edit, delete, and
          activate/deactivate images. The rotator requires exactly 4 images.
        </p>
        <RotatorImageManagement />
      </div>
  )
}

export default RotatorImagesPage

